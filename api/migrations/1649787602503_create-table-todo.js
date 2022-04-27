/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('tbltodo',{
        id: {
            type: 'VARCHAR(21)',
            primaryKey: true
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        status: {
            type: 'BOOLEAN',
            notNull: true
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('tbltodo');
};
