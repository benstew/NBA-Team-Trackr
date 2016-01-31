var db = require('./pghelper');

function escape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function findAll(req, res, next) {

    var pageSize = 12,
        page = req.query.page ? parseInt(req.query.page) : 1,
        search = req.query.search,
        min = req.query.min,
        max = req.query.max,
        whereParts = [],
        values = [];

    console.log(page);

    if (search) {
        values.push(escape(search));
        whereParts.push("team.name || team.mascot || location.name ~* $" + values.length);
    }
    if (min) {
        values.push(parseFloat(min));
        whereParts.push("team.margin >= $" + values.length);
    }
    if (max) {
        values.push(parseFloat(max));
        whereParts.push("team.margin <= $" + values.length);
    }

    var where = whereParts.length > 0 ? ("WHERE " + whereParts.join(" AND ")) : "";

    var countSql = "SELECT COUNT(*) from team INNER JOIN location on team.location_id = location.id " + where;

    var sql = "SELECT team.id, team.name, margin, pace, mascot, image, location.name as location " +
                "FROM team INNER JOIN location on team.location_id = location.id " + where +
                " ORDER BY team.name LIMIT $" + (values.length + 1) + " OFFSET $" +  + (values.length + 2);


    db.query(countSql, values)
        .then(function (result) {
            var total = parseInt(result[0].count);
            db.query(sql, values.concat([pageSize, ((page - 1) * pageSize)]))
                .then(function(teams) {
                    return res.json({"pageSize": pageSize, "page": page, "total": total, "teams": teams});
                })
                .catch(next);
        })
        .catch(next);
};

function findById(req, res, next) {
    var id = req.params.id;

    var sql = "SELECT team.id, team.name, margin, pace, mascot, location.name as location FROM team " +
                "INNER JOIN location on team.location_id = location.id " +
                "WHERE team.id = $1";

    db.query(sql, [id])
        .then(function (team) {
            return res.send(JSON.stringify(team));
        })
        .catch(next);
};

exports.findAll = findAll;
exports.findById = findById;
