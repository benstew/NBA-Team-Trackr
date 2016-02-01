teamService = (function () {

    var baseURL = "";

    // The public API
    return {
        findById: function(id) {
            return $.ajax(baseURL + "/teams/" + id);
        },
        findAll: function(values) {
            return $.ajax({url: baseURL + "/teams", data: values});
        }
    };

}());
