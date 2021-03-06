
var Header = React.createClass({displayName: "Header",
    render: function () {
        return (
            React.createElement("div", {className: "navbar navbar-default navbar-static-top", role: "navigation"},
                React.createElement("div", {className: "container"},
                    React.createElement("div", {className: "navbar-header"}, this.props.text)
                )
            )
        );
    }
});

var SearchBar = React.createClass({displayName: "SearchBar",
    searchKeyChangeHandler: function() {
        var searchKey = this.refs.searchKey.getDOMNode().value;
        this.props.searchKeyChange(searchKey);
    },
    clearText: function() {
        this.refs.searchKey.getDOMNode().value = "";
        this.props.searchKeyChange("");
    },
    render: function () {
        return (
            React.createElement("div", {className: "search-wrapper"},
                React.createElement("input", {type: "search", ref: "searchKey", className: "form-control",
                    placeholder: "Enter a team, city, or division",
                    value: this.props.searchKey,
                    onChange: this.searchKeyChangeHandler}),
                React.createElement("button", {className: "btn btn-link"}, React.createElement("span", {className: "glyphicon glyphicon-remove", "aria-hidden": "true", onClick: this.clearText}))
            )
        );
    }
});

// Wrap nouislider (http://refreshless.com/nouislider) as a React component
var RangeSlider = React.createClass({displayName: "RangeSlider",
    componentDidMount: function() {
        var $el = $(this.refs.slider.getDOMNode()),
            changeHandler = this.props.onChange;
        $el.noUiSlider({
            start: [ this.props.min, this.props.max ],
            connect: true,
            step: this.props.step,
            range: {
                'min': this.props.min,
                'max': this.props.max
            }
        });
        $el.Link('lower').to('-inline-<div class="tooltip"></div>', function ( value ) {
            $(this).html(
                '<span>' + value.substr(0, value.length - 1) + '</span>'
            );
        });
        $el.Link('upper').to('-inline-<div class="tooltip"></div>', function ( value ) {
            $(this).html(
                '<span>' + value.substr(0, value.length - 1) + '</span>'
            );
        });
        $el.on({
            change: function(event){
                changeHandler($el.val());
            }
        });
    },
    render: function () {
        return (
            React.createElement("div", {className: "slider-wrapper"},
                React.createElement("span", {className: "slider-label"}, this.props.label),
                React.createElement("div", {ref: "slider"})
            )
        );
    }
});

var teamListItem = React.createClass({displayName: "teamListItem",
    linkHandler: function(e) {
        this.props.searchKeyChange(e.target.innerHTML);
        return false;
    },
    render: function () {
        var links;
        if (this.props.team.tags) {
            var tags = this.props.team.tags.split(', ');
            links = tags.map(function(tag) {
                return React.createElement("a", {href: "#", className: "tag", onClick: this.linkHandler, key: this.props.team.id + '-' + tag}, tag);
            }.bind(this));
        }
        var divStyle = {"backgroundImage": "url('pics/" + this.props.team.image + "')"};
        return (
            React.createElement("div", {className: "col-lg-3 col-md-4 col-sm-6 col-xs-12 nopadding", key: this.props.team.id},
                React.createElement("div", {className: "panel panel-default"},
                    React.createElement("div", {className: "panel-body"},
                        React.createElement("div", {style: divStyle, className: "img-wrapper"}),
                        React.createElement("h3", {className: "panel-title"}, this.props.team.name),
                        React.createElement("p", {className: "panel-sub-title"}, this.props.team.mascot),
                        React.createElement("p", {className: "level"}, (this.props.team.margin)),
                        // React.createElement("p", {className: "level"}, (this.props.team.pace)),
                        React.createElement("p", {className: "line-item"}, (this.props.team.pace)),
                        React.createElement("p", null, React.createElement("a", {href: "#", onClick: this.linkHandler}, this.props.team.location))
                    )
                )
            )
        );
    }
});

var teamList = React.createClass({displayName: "teamList",
    render: function () {
        var items = this.props.teams.map(function (team) {
            return (
                React.createElement(teamListItem, {key: team.id, team: team, searchKeyChange: this.props.searchKeyChange})
            );
        }.bind(this));
        return (
            React.createElement("div", {className: "container"},
                React.createElement("div", {className: "row"},
                    items
                )
            )
        );
    }
});

var Paginator = React.createClass({displayName: "Paginator",

    render: function () {
        var pages = Math.ceil(this.props.total/this.props.pageSize);
        return (
            React.createElement("div", {className: "container"},
                React.createElement("div", {className: "row padding", style: {height: "40px"}},
                    React.createElement("div", {className: "col-xs-4 nopadding"},
                        React.createElement("button", {type: "button", className: "btn btn-default" + (this.props.page <= 1 ? " hidden" : ""), onClick: this.props.previous},
                            React.createElement("span", {className: "glyphicon glyphicon-chevron-left", "aria-hidden": "true"}), " Previous"
                        )
                    ),
                    React.createElement("div", {className: "col-xs-4 text-center"},
                        React.createElement("div", {className: "legend"}, this.props.total, " team(s) • page ", this.props.page, "/", pages)
                    ),
                    React.createElement("div", {className: "col-xs-4 nopadding"},
                        React.createElement("button", {type: "button", className: "btn btn-default pull-right" + (this.props.page >= pages ? " hidden" : ""), onClick: this.props.next},
                        "Next ", React.createElement("span", {className: "glyphicon glyphicon-chevron-right", "aria-hidden": "true"})
                        )
                    )
                )
            )
        );
    }
});


var App = React.createClass({displayName: "App",
    getInitialState: function() {
        return {
            searchKey: "",
            min: -20,
            max: 20,
            teams: [],
            total: 0,
            page: 1
        }
    },
    componentDidMount: function() {
        this.findteams();
    },
    searchKeyChangeHandler: function(searchKey) {
        this.setState({searchKey: searchKey, page: 1}, this.findteams);
    },
    rangeChangeHandler: function(values) {
        this.setState({min: values[0], max: values[1], page: 1}, this.findteams);
    },
    findteams: function() {
        teamService.findAll({search: this.state.searchKey, min: this.state.min, max: this.state.max, page: this.state.page}).done(function(data) {
            this.setState({
                teams: data.teams,
                page: data.page,
                pageSize: data.pageSize,
                total: data.total
            });
        }.bind(this));
    },
    nextPage: function() {
        var p = this.state.page + 1;
        this.setState({page: p}, this.findteams);
    },
    prevPage: function() {
        var p = this.state.page - 1;
        this.setState({page: p}, this.findteams);
    },
    render: function() {
        return (
            React.createElement("div", null,
                React.createElement(Header, {text: "NBA Team Trackr"}),
                React.createElement("div", {className: "container"},
                    React.createElement("div", {className: "row"},
                        React.createElement("div", {className: "center-block trim"},
                            React.createElement(SearchBar, {searchKey: this.state.searchKey, searchKeyChange: this.searchKeyChangeHandler}),
                            React.createElement(RangeSlider, {label: "Average Margin of Victory (points)", min: -20, max: 20, step: 1, onChange: this.rangeChangeHandler})
                        )
                    )
                ),
                React.createElement(Paginator, {page: this.state.page, pageSize: this.state.pageSize, total: this.state.total, previous: this.prevPage, next: this.nextPage}),
                React.createElement(teamList, {teams: this.state.teams, total: this.state.total, searchKeyChange: this.searchKeyChangeHandler})
            )
        );
    }
});

React.render(React.createElement(App, null), document.getElementById('main'));
