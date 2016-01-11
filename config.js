exports.bz_env_var = function (config) {
    var res = {
        RENAISSANCE_BZ_PUB_PORT: config.bz.pub_port,
        RENAISSANCE_BZ_PRIV_PORT: config.bz.priv_port,
        RENAISSANCE_BZ_BACKEND: config.bz.backend.name,
        RENAISSANCE_BZ_GJANAJO_PORT: config.gjanajo.port
    };

    switch (config.bz.backend.name) {
    case "yesman":
        res["RENAISSANCE_BZ_YESMAN_USERDB"] = config.bz.backend.config.userdb;
        break;
    }

    return res;
}

exports.gjanajo_env_var = function (config) {
    var res = {
        RENAISSANCE_GJANAJO_PORT: config.gjanajo.port
    };

    switch (config.gjanajo.backend.name) {
    case "sqlite":
        res["RENAISSANCE_GJANAJO_SQLITE_DB"] = config.gjanajo.backend.config.db;
        break;
    }

    return res;
}
