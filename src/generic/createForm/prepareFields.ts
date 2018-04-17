import { Obj, root } from 'common';
import keysToObject from 'keys-to-object';

const mapArray = (v: any, map: (x: any) => any) =>
  Array.isArray(v) ? v.map(map) : map(v);

const isObject = (v: any) =>
  Object.prototype.toString.call(v) === '[object Object]';
const merge = (target: any, source: Obj, depth: number = -1) => {
  const result = {};
  if (isObject(target)) {
    Object.keys(target).forEach(k => (result[k] = clone(target[k])));
  }
  Object.keys(source).forEach(k => {
    if (!isObject(source[k]) || !target[k] || depth === 0) {
      result[k] = clone(source[k]);
    } else {
      result[k] = merge(target[k], source[k], depth - 1);
    }
  });
  return result;
};
const clone = (obj: any, depth = -1) =>
  isObject(obj) ? merge({}, obj, depth) : obj;

export const getFieldKey = (objects: Obj, key: string) => {
  const [obj, f] = key.split('.');
  return [objects[obj].type, objects[obj].id, f] as [string, string, string];
};

export default async (blockProps, configObjects = {}, blocks, stores) => {
  const objectKeys = Object.keys(configObjects);
  const response = await root.rgo.query(
    ...objectKeys.filter(obj => configObjects[obj].filter).map(obj => ({
      name: configObjects[obj].type,
      alias: obj,
      filter: configObjects[obj].filter,
      end: 1,
      fields: ['id'],
    })),
  );
  const objects = keysToObject(objectKeys, obj => ({
    ...configObjects[obj],
    id:
      configObjects[obj].id ||
      (response[obj] && response[obj][0] && response[obj][0].id) ||
      root.rgo.create(configObjects[obj].type),
  }));
  const getInitialValue = ([type, _, f]: string[], value: any) =>
    (root.rgo.schema[type][f] as any).type
      ? mapArray(value, v => (objects[v] ? objects[v].id : v))
      : value;
  const allFields: any[] = [];
  const mappedBlocks = blocks.map(blockSet =>
    blockSet.map(({ fields, ...block }) => {
      const config = { block: {} as Obj, field: {} as Obj };
      Object.keys(block).forEach(
        k => (config[blockProps.includes(k) ? 'block' : 'field'][k] = block[k]),
      );
      const blockFields = (fields
        ? fields.map(f => merge(f, config.field))
        : config.field.field || config.field.name
          ? [config.field]
          : []
      ).reduce((res, { field, name, initial, ...other }) => {
        const key = field && getFieldKey(objects, field);
        const { meta = {}, ...schema } = field
          ? root.rgo.schema[key[0]][key[2]]
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
            ...(field ? { ...schema, ...meta } : {}),
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
          optional: true,
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
