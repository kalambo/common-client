import { Query } from 'rgo';
import { getValueString, Obj, root } from 'common';

const processQuery = (query: Partial<Query>) => ({
  ...query,
  fields: [
    ...(query.fields || ['id']).map(
      f => (typeof f === 'string' ? f : processQuery(f)),
    ),
  ],
});

export default async (query, filename) => {
  const fullData = await root.rgo.query(processQuery(query));
  const headers: string[] = [];
  const processLayer = (
    { name, alias, fields }: Query,
    data: (Obj | null)[],
    type: string,
    indent = '',
  ) => {
    headers.push(`${indent}${alias || name}`);
    const fullValues = fields.reduce<any[]>((result, f) => {
      if (typeof f === 'string') {
        headers.push(`${indent}      ${f}`);
        return [
          ...result,
          data.map(d => [
            getValueString(
              d && d[f],
              (root.rgo.schema[type][f] as any).scalar || 'string',
            ),
          ]),
        ];
      }
      const val = processLayer(
        f,
        data.reduce<Obj[]>(
          (res, d) => res.concat(d && d[f.alias || f.name]),
          [],
        ),
        (root.rgo.schema[type][f.name] as any).type,
        indent + '      ',
      );
      return [
        ...result,
        ...val.map(row => {
          let index = 0;
          return data.map(d =>
            []
              .concat(d && d[f.alias || f.name])
              .reduce<any[]>(res => [...res, ...row[index++]], []),
          );
        }),
      ];
    }, []);
    const spans = data.map((_, i) =>
      Math.max(...fullValues.map(row => row[i].length)),
    );
    return [
      spans.map(s => Array(s).fill('')),
      ...fullValues.map(row =>
        row.map((v, i) => {
          const start = v.length;
          v[spans[i] - 1] = v[spans[i] - 1] || '';
          return v.fill('', start, spans[i]);
        }),
      ),
    ];
  };
  const rows = Array.isArray(query)
    ? query
    : [query].reduce(
        (res, q) => [
          ...res,
          ...processLayer(q, fullData[q.alias || q.name], q.name),
        ],
        [],
      );

  const csv = rows
    .map((row, i) => [headers[i], ...row[0]].map(v => `°${v || ''}°`).join(','))
    .join('\n')
    .replace(/"/g, '""')
    .replace(/°/g, '"');

  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(`data:text/csv;charset=utf-8,${csv}`));
  link.setAttribute('download', `${filename || 'data'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
