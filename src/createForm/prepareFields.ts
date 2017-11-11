import { Obj } from 'mishmash';
import * as _ from 'lodash';

const mapArray = (v: any, map: (x: any) => any) =>
  Array.isArray(v) ? v.map(map) : map(v);

export const getFieldKey = (objects: Obj, key: string) => {
  const [obj, f] = key.split('.');
  return [objects[obj].type, objects[obj].id, f] as [string, string, string];
};

export default async (blockProps, objects = {}, blocks, stores) => {
  const objectKeys = Object.keys(objects);
  const response = await window.rgo.query(
    ...objectKeys.filter(obj => objects[obj].filter).map(obj => ({
      name: objects[obj].type,
      alias: obj,
      filter: objects[obj].filter,
      end: 1,
      fields: ['id'],
    })),
  );
  objectKeys.forEach(obj => {
    objects[obj].id =
      objects[obj].id ||
      (response[obj] && response[obj][0] && response[obj][0].id) ||
      window.rgo.create(objects[obj].type);
  });
  const getInitialValue = ([type, _, f]: string[], value: any) =>
    (window.rgo.schema[type][f] as any).type
      ? mapArray(value, v => (objects[v] ? objects[v].id : v))
      : value;
  const allFields: any[] = [];
  const mappedBlocks = blocks.map(blockSet =>
    blockSet.map(({ fields, ...block }) => {
      const config = {
        block: _.pick(block, blockProps) as Obj,
        field: _.omit(block, blockProps) as Obj,
      };
      const blockFields = (fields
        ? fields.map(f => ({ ...f, ...config.field }))
        : config.field.field || config.field.name ? [config.field] : []
      ).reduce((res, { field, name, initial, ...other }) => {
        const key = field && getFieldKey(objects, field);
        const { meta = {}, ...schema } = field
          ? window.rgo.schema[key[0]][key[2]]
          : {};
        if (field) {
          ['gt', 'lt'].filter(k => other[k]).forEach(k => {
            other[k] = `${field.split('.')[0]}.${other[k]}`;
          });
        }
        return [
          ...res,
          {
            key: {
              store: field ? 'rgo' : 'local',
              key: field ? key : name,
              name: field ? field : name,
            },
            initial: field ? getInitialValue(key, initial) : initial,
            ...field ? { ...schema, ...meta } : {},
            ...other,
          },
          ...['gt', 'lt'].filter(k => other[k]).map(k => ({
            key: {
              store: 'rgo',
              key: other[k].includes('.')
                ? getFieldKey(objects, other[k])
                : other[k],
              name: other[k],
            },
          })),
        ];
      }, []);
      allFields.push(...blockFields);
      return { ...config.block, fields: blockFields };
    }),
  );
  objectKeys.forEach(obj => {
    Object.keys(objects[obj].initial || {}).forEach(k => {
      const key = [objects[obj].type, objects[obj].id, k];
      const initial = getInitialValue(key, objects[obj].initial[k]);
      const field = allFields.find(f => f.key.name === `${obj}.${k}`);
      if (field) {
        field.initial = initial;
      } else {
        allFields.push({
          key: { store: 'rgo', key, name: `${obj}.${k}` },
          initial: getInitialValue(key, objects[obj].initial[k]),
        });
      }
    });
  });
  ['rgo', 'local'].forEach(store =>
    stores[store].set(
      allFields
        .filter(f => f.key.store === store && f.initial !== undefined)
        .map(f => ({ key: f.key.key, value: f.initial })),
    ),
  );
  return { objects, blocks: mappedBlocks, fields: allFields };
};
