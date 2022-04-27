/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('tbltodo', {
        owner: {
            type: 'TEXT',
            notNull: true
        }
    })

    pgm.addConstraint('tbltodo','fk_tbltodo.owner_users.id','FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropColumns('tbltodo','owner',{
        ifExists: true
    });
};
