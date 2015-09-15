'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc overview
     * @name index
     * @description
     *
     * # Eureka Documentation
     *
     * Do you need help understanding the project structure or what services and directives you have available to you
     * in the Eureka Angular application? You've come to the right place!
     *
     * ## How to use this documentation
     *
     * This code-base is self-documenting; this documentation is automatically generated from comments left throughout
     * the code. If there is a problem with it, it is because the comments in the code were not updated.
     *
     * This project is broken down into several modules. Each module represents a section of the application. Inside
     * each module you will find views, directives, and services specific to that module. This allows you to bite off
     * code changes in smaller pieces and keeps everything organized in a sane manner.
     */

    /**
     * @ngdoc overview
     * @name eureka
     * @description
     * The main module for the Eureka Angular app.
     * @requires ui.router
     * @requires angularValidator
     * @requires cohorts
     * @requires phenotypes
     * @requires register
     */
    angular.module('eureka', ['ui.router', 'angularValidator', 'eureka.cohorts', 'eureka.phenotypes', 'eureka.register']);

    angular.module('eureka').run(eurekaRun);
    angular.module('eureka').config(eurekaConfig);

    eurekaRun.$inject = ['$rootScope', 'appProperties', 'users'];
    eurekaConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function eurekaRun($rootScope, appProperties, users) {
        $rootScope.app = appProperties;
        $rootScope.user = {
            isActivated: false
        };
        $rootScope.conceptionYear = '2012';
        $rootScope.currentYear = new Date().getFullYear();
        users.getUser().then(function (user) {
            $rootScope.user = user;
        });
    }

    function eurekaConfig($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/index');

        $stateProvider.state('index', {
            url: '/index',
            templateUrl: 'eureka/views/main/main.html'
        });
    }
})();
'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc overview
     * @name eureka.cohorts
     * @description
     * The module for the cohorts section of the Eureka application.
     */
    angular.module('eureka.cohorts', []);

    angular.module('eureka.cohorts').config(cohortsConfig);

    cohortsConfig.$inject = ['$stateProvider'];

    function cohortsConfig($stateProvider) {

        $stateProvider.state('cohorts', {
            url: '/cohorts',
            templateUrl: 'eureka/cohorts/views/main/main.html',
            controller: 'cohorts.MainCtrl',
            controllerAs: 'cohorts'
        }).state('newCohort', {
            url: '/cohorts/new',
            templateUrl: 'eureka/cohorts/views/new/new.html',
            controller: 'cohorts.NewCtrl',
            controllerAs: 'newCohort'
        }).state('editCohort', {
            url: '/cohorts/:key',
            templateUrl: 'eureka/cohorts/views/edit/edit.html',
            controller: 'cohorts.EditCtrl',
            controllerAs: 'editCohort'
        });
    }
})();
'use strict';

(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name eureka.phenotypes
   * @description
   * The module for the phenotypes section of the Eureka application.
   */
  angular.module('eureka.phenotypes', []);
})();
'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc overview
     * @name eureka.register
     * @description
     * The module for the register section of the Eureka application.
     */
    angular.module('eureka.register', []);

    angular.module('eureka.register').config(registerConfig);

    registerConfig.$inject = ['$stateProvider'];

    function registerConfig($stateProvider) {

        $stateProvider.state('register', {
            url: '/register',
            templateUrl: 'eureka/register/views/main/main.html',
            controller: 'register.MainCtrl',
            controllerAs: 'register'
        });
    }
})();
'use strict';

(function () {

    'use strict';

    var appProperties = {
        demoMode: true,
        ephiProhibited: true,
        registrationEnabled: true,
        aiwSiteUrl: 'http://aiw.sourceforge.net',
        organizationName: 'Emory University',
        apiEndpoint: '/eureka-services/api/protected'
    };

    /**
     * @ngdoc object
     * @name eureka.appProperties
     * @description
     * Simple configuration object that stores application properties.
     */

    angular.module('eureka').value('appProperties', appProperties);
})();
/* globals self */
'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name eureka.directive:jstree
     * @element *
     * @function
     * @description
     * jstree wrapper directive
     * @requires eureka.listDragAndDropService
     */
    angular.module('eureka').directive('jstree', jstree);

    jstree.$inject = ['listDragAndDropService'];

    function jstree(listDragAndDropService) {

        return {
            scope: {
                data: '='
            },
            template: '<div id="filter">Tree did not load.</div>',
            restrict: 'E',
            controller: function controller($scope, $element, $attrs, $rootScope) {},
            link: function link(scope, element, attrs) {
                self.droppedElements = {};
                self.propId = null;
                self.propType = null;
                self.propSubType = null;
                var initData = null;
                var searchUpdateDivElem = attrs.searchUpdateDiv;
                var searchModalElem = attrs.searchModal;
                var searchValidationModalElem = attrs.searchValidationModal;
                var searchNoResultsModalElem = attrs.searchNoResultsModal;
                var treeCssUrl = attrs.treeCssUrl;

                $(element).jstree({
                    core: {
                        data: {
                            url: attrs.treeUrl,
                            dataType: 'json',
                            data: function data(n) {
                                return {
                                    key: n.id === '#' ? 'root' : n.id
                                };
                            }

                        }

                    },

                    plugins: ['themes', 'json_data', 'ui', 'crrm', 'dnd', 'search']
                });

                $(element).before($('<form id="search">' + '<span></span>' + '<div class="input-group"><input id="searchText" class="form-control" type="text" />' + '<div class="input-group-btn">' + '<input id="searchTree" class="btn btn-default" type=submit value="search" />' + '<input class="btn btn-default" type="reset" value="X" /></div></div>' + '</form>').bind({
                    reset: function reset(evt) {
                        $(element).jstree('clear_search');
                        $(element).jstree(true).settings.core.data = initData;
                        $(element).jstree(true).refresh();
                        $('#search span').html('');
                    },

                    submit: function submit(evt) {
                        $(element).jstree('clear_search');
                        var searchvalue = $('#search input[type="text"]').val();
                        initData = $(element).jstree(true).settings.core.data;
                        if (searchvalue !== '' && searchvalue.length >= 4) {
                            $(element).hide();
                            var $elem = $(searchUpdateDivElem);
                            $elem.text('Search is in progress. Please wait...');
                            $elem.show();

                            $(element).jstree('destroy');
                            $(element).jstree({
                                'core': {
                                    'data': {
                                        'url': function url(node) {
                                            return node.id === '#' ? attrs.treeSearch + '?str=' + searchvalue : attrs.treeUrl;
                                        },
                                        'dataType': 'json',
                                        'data': function data(node) {
                                            return {
                                                key: node.id === '#' ? 'root' : node.id

                                            };
                                        }
                                    }
                                },
                                'themes': {
                                    'name': 'default',
                                    'theme': 'default',
                                    'url': treeCssUrl
                                },
                                'plugins': ['themes', 'json_data', 'ui', 'crrm', 'dnd', 'search']
                            }).bind('loaded.jstree', function (e, data) {

                                if (data.instance._cnt === 0) {
                                    console.log('empty');
                                    var $elemNoResults = $(searchNoResultsModalElem);
                                    $elemNoResults.find('#searchContent').html('There are no entries in our\n                                            database that matched your search criteria.');
                                    $elemNoResults.modal('toggle');

                                    $elemNoResults.hide();
                                    $(element).jstree('clear_search');
                                    $(element).jstree(true).settings.core.data = initData;
                                    $(element).jstree(true).refresh();
                                    $('#searchText').val('');

                                    $(element).show();

                                    $elemNoResults = $(searchUpdateDivElem);
                                    $elemNoResults.hide();
                                } else if (data.instance._cnt > 200) {
                                    var $elemSearchModal = $(searchModalElem);
                                    $elemSearchModal.find('#searchContent').html('The number of search results\n                                                exceeded the maximum limit and all results might not be displayed.\n                                                Please give a more specific search query to see all results.');
                                    $elemSearchModal.modal('toggle');

                                    $elemSearchModal.hide();
                                    $(element).jstree('clear_search');
                                    $(element).jstree(true).settings.core.data = initData;
                                    $(element).jstree(true).refresh();
                                    $('#searchText').val('');

                                    $(element).show();

                                    $elemSearchModal = $(searchUpdateDivElem);
                                    $elemSearchModal.hide();
                                }
                            });

                            $elem.hide();
                            $(element).show();
                        } else if (searchvalue.length < 4) {
                            var $elemValidationModal = $(searchValidationModalElem);
                            $elemValidationModal.find('#searchContent').html('Please enter a search value with\n                                        length greater than 3.');
                            $elemValidationModal.modal('toggle');
                            $(element).show();
                        }
                        return false;
                    }

                }));

                $(document).on('dnd_move.vakata', function (e, data) {
                    var t = $(data.event.target);
                    if (!t.closest('.jstree').length) {
                        if (t.closest('.tree-drop').length) {
                            data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok');
                        } else {
                            data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er');
                        }
                    }
                });

                $(document).on('dnd_stop.vakata', function (e, data) {
                    self.dropFinishCallback(data);
                });

                self.attachClearModalHandlers = function () {
                    var deleteModal = $('#deleteModal');
                    if (deleteModal) {
                        var $deleteButton = $(deleteModal).find('#deleteButton');
                        $(deleteModal).on('hidden.bs.modal', function (e) {
                            $deleteButton.off('click');
                        });
                    }
                    var replaceModal = $('#replaceModal');
                    if (replaceModal) {
                        var $replaceButton = $(replaceModal).find('#replaceButton');
                        $(replaceModal).on('hidden.bs.modal', function (e) {
                            $replaceButton.off('click');
                        });
                    }
                };

                self.dropFinishCallback = function (data) {
                    var target = data.event.target;
                    // SBA
                    target = $(target).closest('#patCohortDefinition');
                    var textContent = data.data.origin.get_node(data.data.obj[0].id).original.text;

                    if (listDragAndDropService.idIsNotInList(target, data.data.obj[0].id)) {
                        var sortable = $(target).find('ul.sortable');
                        var elementKey = data.data.obj[0].id;
                        var newItem = $('<li></li>').attr('data-space', data.data.origin.get_node(elementKey).original.attr['data-space']).attr('data-desc', textContent).attr('data-type', data.data.origin.get_node(elementKey).original.attr['data-type']).attr('data-subtype', data.data.origin.get_node(elementKey).original.attr['data-subtype'] || '').attr('data-key', data.data.origin.get_node(elementKey).original.attr['data-proposition'] || data.data.origin.get_node(elementKey).original.attr['data-key']);

                        // check that all types in the categorization are the same
                        // SBA look here
                        if ($(sortable).data('drop-type') === 'multiple' && $(sortable).data('proptype') !== 'empty') {
                            if ($(sortable).data('proptype') !== $(newItem).data('type')) {
                                return;
                            }
                        } else {
                            var tmptype = $(newItem).data('type');
                            $(sortable).data('proptype', tmptype);
                        }

                        //this loop is executed only during replacement of a system element when droptype==single.
                        // In all other cases(adding element to multiple droptype lists, adding a new element to an
                        // empty list) the else statement is executed.
                        if ($(sortable).data('drop-type') === 'single' && $(sortable).find('li').length > 0) {
                            var $toRemove = $(sortable).find('li');
                            var dialog = $('#replaceModal');
                            $(dialog).find('#replaceContent').html('Are you sure you want to replace data element &quot;' + $toRemove.text().trim() + '&quot;?');
                            $(dialog).find('#replaceButton').on('click', function (e) {
                                listDragAndDropService.deleteItem($toRemove, $(sortable), 0);
                                listDragAndDropService.addNewItemToList(data, $(sortable), newItem);
                                $(dialog).modal('hide');
                            });
                            $(dialog).modal('show');
                        } else {
                            listDragAndDropService.addNewItemToList(data, sortable, newItem);
                        }
                    }
                };
            }
        };
    }
})();
/* globals self */
'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name eureka.listDragAndDropService
     * @description
     * This is the list drag and drop service.
     */

    angular.module('eureka').factory('listDragAndDropService', listDragAndDropService);

    listDragAndDropService.$inject = [];

    function listDragAndDropService() {

        return {
            getIn: getIn,
            setIn: setIn,
            removeIn: removeIn,
            objSize: objSize,
            addDroppedElement: addDroppedElement,
            deleteElement: deleteElement,
            deleteItem: deleteItem,
            removeDroppedElement: removeDroppedElement,
            addNewItemToList: addNewItemToList,
            idIsNotInList: idIsNotInList,
            setPropositionSelects: setPropositionSelects,
            attachDeleteAction: attachDeleteAction

        };

        function getIn(obj, path) {
            var current = obj;
            for (var i = 0; i < path.length; i++) {
                current = current[path[i]];
                if (!current) {
                    break;
                }
            }
            return current;
        }

        function setIn(obj, path, value) {
            var current = obj;
            for (var i = 0; i < path.length - 1; i++) {
                var tmp = current[path[i]];
                if (!tmp) {
                    tmp = {};
                    current[path[i]] = tmp;
                }
                current = tmp;
            }
            current[path[path.length - 1]] = value;
        }

        function removeIn(obj, path) {
            var current = obj;
            for (var i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
                if (current === null) {
                    break;
                }
            }
            delete current[path[path.length - 1]];
        }

        function objSize(obj) {
            var size = 0;
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    size++;
                }
            }
            return size;
        }

        function addDroppedElement(dropped, dropTarget) {
            var elementKey = $(dropped).data('key');
            var sourceId = $(dropTarget).data('count');
            var sourcePath = [self.propType, elementKey, 'sources', sourceId];
            var defPath = [self.propType, elementKey, 'definition'];
            var definition = getIn(self.droppedElements, defPath);

            setIn(self.droppedElements, sourcePath, dropTarget);
            if (!definition) {
                var properties = ['key', 'desc', 'type', 'subtype', 'space'];
                definition = {};
                $.each(properties, function (i, property) {
                    definition[property] = $(dropped).data(property);
                });
                setIn(self.droppedElements, defPath, definition);
            }

            var allSourcesPath = [self.propType, elementKey, 'sources'];
            var allSources = getIn(self.droppedElements, allSourcesPath);
            var size = objSize(allSources);
            function iterateItems(i, item) {
                var span = $(item).find('span.desc');
                var newText = $(dropped).data('desc') + ' [' + $(source).data('count') + ']';
                $(span).text(newText);
            }
            if (size > 1) {
                for (var key in allSources) {
                    if (allSources.hasOwnProperty(key)) {
                        var source = allSources[key];
                        var items = $(source).find('li');
                        $(items).each(iterateItems);
                    }
                }
            }
        }

        function deleteElement(displayName, key) {
            var $dialog = $('<div></div>').html('Are you sure you want to delete cohort &quot;' + displayName.trim() + '&quot;? You cannot undo this action.').dialog({
                title: 'Delete Data Element',
                modal: true,
                resizable: false,
                buttons: {
                    'Delete': function Delete() {
                        $.ajax({
                            type: 'POST',
                            url: 'deletecohort?key=' + encodeURIComponent(key),
                            success: function success(data) {
                                $(this).dialog('close');
                                window.location.href = 'editorhome';
                            },
                            error: function error(data, statusCode) {
                                var $errorDialog = $('<div></div>').html(data.responseText).dialog({
                                    title: 'Error Deleting Data Element',
                                    buttons: {
                                        'OK': function OK() {
                                            $(this).dialog('close');
                                        }
                                    },
                                    close: function close() {
                                        $dialog.dialog('close');
                                    }
                                });
                                $errorDialog.dialog('open');
                            }
                        });
                    },
                    'Cancel': function Cancel() {
                        $(this).dialog('close');
                    }
                },
                close: function close() {
                    // do nothing here.
                }
            });
            $dialog.dialog('open');
        }

        function removeDroppedElement(removed, removeTarget) {
            var elementKey = $(removed).data('key');
            var sourceId = $(removeTarget).data('count');
            var path = [self.propType, elementKey, 'sources', sourceId];
            removeIn(self.droppedElements, path);

            var allSourcesPath = [self.propType, elementKey, 'sources'];
            var allSources = getIn(self.droppedElements, allSourcesPath);
            var size = objSize(allSources);
            function iterateItems(i, item) {
                var span = $(item).find('span.desc');
                var newText = $(removed).data('desc');
                $(span).text(newText);
            }
            if (size <= 1) {
                for (var key in allSources) {
                    if (allSources.hasOwnProperty(key)) {
                        var source = allSources[key];
                        var items = $(source).find('li');
                        $(items).each(iterateItems);
                    }
                }
            }
        }

        function deleteItem(toRemove, sortable, replace) {
            var infoLabel = sortable.siblings('div.label-info');
            var target = sortable.parent();
            removeDroppedElement(toRemove, sortable);
            setPropositionSelects(sortable.closest('[data-definition-container="true"]'));
            toRemove.remove();
            if (sortable.find('li').length === 0 && replace === 0) {
                sortable.data('proptype', 'empty');
                infoLabel.show();
            }

            // remove the properties from the drop down
            $('select[data-properties-provider=' + $(target).attr('id') + ']').each(function (i, item) {
                $(item).empty();
            });
            //remove the disabled attribute to the property textbox if any.
            var parentTable = $(target).parent().parent().parent();
            var inputProperty = $(parentTable).find('input.propertyValueField');
            $(inputProperty).removeAttr('disabled');
            var inputPropertycheckbox = $(parentTable).find('input.propertyValueConstraint');
            $(inputPropertycheckbox).removeAttr('disabled');

            // perform any additional delete actions
            if (self.deleteActions && self.deleteActions[self.propType]) {
                self.deleteActions[self.propType]();
            }
        }

        function idIsNotInList(target, id) {
            var retVal = true;
            $(target).find('ul.sortable').find('li').each(function (i, item) {
                if ($(item).data('key') === id) {
                    retVal = false;
                }
            });
            return retVal;
        }

        function addNewItemToList(data, sortable, newItem) {
            var target = $(sortable).parent();

            $(target).find('div.label-info').hide();

            var X = $('<span></span>', {
                'class': 'glyphicon glyphicon-remove delete-icon',
                'data-action': 'remove'
            });

            attachDeleteAction(X);
            var textContent = data.data.origin.get_node(data.data.obj[0].id).original.text;

            newItem.append(X);
            newItem.append(textContent);

            sortable.append(newItem);

            // set the properties in the properties select
            if ($(data.data.obj[0]).data('properties')) {
                var properties = $(data.data.obj[0]).data('properties').split(',');
                $('select[data-properties-provider=' + $(target).attr('id') + ']').each(function (i, item) {
                    $(item).empty();
                    $(properties).each(function (j, property) {
                        $(item).append($('<option></option>').attr('value', property).text(property));
                    });
                });
            } else {
                var parent = $(target).closest('.form-group').parent();
                var inputProperty = $(parent).find('input.propertyValueField');
                $(inputProperty).attr('disabled', 'disabled');
                var inputPropertycheckbox = $(parent).find('input.propertyValueConstraint');
                $(inputPropertycheckbox).attr('disabled', 'disabled');
            }

            // add the newly dropped element to the set of dropped elements
            addDroppedElement(newItem, sortable);
            setPropositionSelects($(sortable).closest('[data-definition-container="true"]'));

            // finally, call any actions specific to the type of proposition being entered/edited
            if (self.dndActions && self.dndActions[self.propType]) {
                self.dndActions[self.propType](data.data.obj[0]);
            }
        }

        function setPropositionSelects(elem) {
            var droppedElems = self.droppedElements[self.propType];

            // this prevents an error in the inner loop which tries to
            // loop over this null object.
            if (droppedElems === null) {
                return;
            }

            var selects = $(elem).find('select[name="propositionSelect"]');
            $(selects).each(function (i, sel) {
                var $sortable = $(sel).closest('.drop-parent').find('ul.sortable');
                var originalSource = $(sel).data('sourceid');
                $(sel).attr('data-sourceid', '');
                $(sel).empty();
                $.each(droppedElems, function (elemKey, elemValue) {
                    var sources = droppedElems[elemKey]['sources'];
                    $.each(sources, function (sourceKey, sourceValue) {
                        var $items = $(sourceValue).find('li');
                        var selectedItem;
                        $items.each(function (i, item) {
                            if ($(item).data('key') === elemKey) {
                                selectedItem = item;
                            }
                            if (selectedItem && $sortable.data('count') !== $(sourceValue).data('count')) {
                                var sourceId = $(sourceValue).data('count');
                                var value = $(selectedItem).data('key') + '__' + sourceId;
                                var desc = $(selectedItem).data('desc');
                                if (self.objSize(sources) > 1) {
                                    desc += ' [' + sourceKey + ']';
                                }
                                var opt = $('<option></option>', {
                                    'value': value
                                }).text(desc);
                                if (value === $(selectedItem).data('key') + '__' + originalSource) {
                                    opt.attr('selected', 'selected');
                                }
                                $(sel).append(opt);
                            }
                        });
                    });
                });
            });
        }

        function attachDeleteAction(elem) {
            $(elem).each(function (i, item) {
                $(item).click(function () {
                    var $toRemove = $(item).closest('li');
                    var $sortable = $toRemove.closest('ul.sortable');
                    var dialog = $('#deleteModal');
                    $(dialog).find('#deleteContent').html('Are you sure you want to remove data element &quot;' + $toRemove.text().trim() + '&quot;?');
                    $(dialog).find('#deleteButton').on('click', function (e) {
                        deleteItem($toRemove, $sortable, 0);
                        $(dialog).modal('hide');
                    });
                    $(dialog).modal('show');
                });
            });
        }

        self.dndActions = {};
        self.deleteActions = {};
    }
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {

    'use strict';

    /**
     * @ngdoc service
     * @name eureka.users
     * @description
     * This is the users service.
     * @requires $http
     * @requires $q
     * @requires eureka.appProperties
     */

    angular.module('eureka').factory('users', users);

    users.$inject = ['$http', '$q', 'appProperties'];

    function users($http, $q, appProperties) {
        var apiEndpoint = appProperties.apiEndpoint;

        return {
            getUser: getCurrentUser,
            getRole: getRole
        };

        function getRole(roleId) {
            return $http.get(apiEndpoint + '/role/' + roleId).then(function (res) {
                return res.data;
            }, function (err) {
                console.error('role retrieval failed:', err);
                return err;
            });
        }

        function getCurrentUser() {
            return $http.get(apiEndpoint + '/users/me', {
                transformResponse: function transformResponse(data) {
                    try {
                        var jsonObject = JSON.parse(data); // verify that json is valid
                        return jsonObject;
                    } catch (e) {
                        console.log('User is not logged in!');
                    }
                }
            }).then(function (res) {
                var userInfo = res.data;
                if (!userInfo) {
                    return $q.when(null);
                }
                return $q.all(_.map(userInfo.roles, getRole)).then(function (roles) {
                    userInfo.roles = roles;
                    console.log('user info!', userInfo);
                    return new User(userInfo);
                });
            }, function (err) {
                console.error('error getting user:', err);
            });
        }
    }

    var User = (function () {
        function User(info) {
            _classCallCheck(this, User);

            this.info = info;
        }

        _createClass(User, [{
            key: 'hasRole',
            value: function hasRole(name) {
                var roles = this.info.roles;

                return roles.some(function (role) {
                    return role.name === name;
                });
            }
        }, {
            key: 'getFullName',
            value: function getFullName() {
                var _info = this.info;
                var fullName = _info.fullName;
                var firstName = _info.firstName;
                var lastName = _info.lastName;

                return fullName || firstName + ' ' + lastName;
            }
        }]);

        return User;
    })();
})();
'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name eureka.cohorts.CohortService
     * @description
     * This service provides an API to interact with the REST endpoint for cohorts.
     * @requires $http
     * @requires $q
     */

    angular.module('eureka.cohorts').factory('CohortService', CohortService);

    CohortService.$inject = ['$http', '$q'];

    function CohortService($http, $q) {

        return {
            getCohorts: getCohorts,
            getCohort: getCohort,
            getSystemElement: getSystemElement,
            getPhenotypes: getPhenotypes,
            removeCohort: removeCohort
        };

        function getCohorts() {

            var type = 'COHORT';
            return $http.get('/eureka-services/api/protected/destinations?type=' + type).then(handleSuccess, handleError);
        }

        function removeCohort(key) {

            return $http['delete']('/eureka-webapp/proxy-resource/destinations/' + key).then(handleSuccess, handleError);
        }

        function getSystemElement(key) {

            return $http.get('/eureka-services/api/protected/systemelement/' + key + '?summary=true').then(handleSuccess, handleError);
        }
        function getCohort(cohortId) {

            return $http.get('/eureka-services/api/protected/destinations/' + cohortId).then(handleSuccess, handleError);
        }
        function getPhenotypes(cohort) {

            var cohorts = [];

            function traverse(node) {

                if (node.left_node !== undefined) {
                    traverse(node.left_node);
                }

                if (node.name !== undefined) {
                    cohorts.push(node.name);
                }

                if (node.right_node !== undefined) {
                    traverse(node.right_node);
                }
            }

            traverse(cohort.node);

            var promises = [];
            angular.forEach(cohorts, function (cohort) {
                var promise = $http.get('/eureka-services/api/protected/systemelement/' + cohort + '?summary=true');
                promises.push(promise);
            });

            return $q.all(promises);
        }
        function handleSuccess(response) {
            return response.data;
        }
        function handleError(response) {
            if (!angular.isObject(response.data) && !response.data) {
                return $q.reject('An unknown error occurred.');
            }
            return $q.reject(response.data);
        }
    }
})();
'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name eureka.phenotypes.PhenotypeService
     * @description
     * This service provides an API to interact with the REST endpoint for phenotypes.
     * @requires $http
     * @requires $q
     */

    angular.module('eureka.phenotypes').factory('PhenotypeService', PhenotypeService);

    PhenotypeService.$inject = ['$http', '$q'];

    function PhenotypeService($http, $q) {

        return {
            getSummarizedUserElements: getSummarizedUserElements
        };

        function getSummarizedUserElements() {
            return $http.get('/eureka-services/api/protected/dataelement?summarize=true').then(handleSuccess, handleError);
        }

        function handleSuccess(response) {
            return response.data;
        }

        function handleError(response) {
            if (!angular.isObject(response.data) && !response.data) {
                return $q.reject('An unknown error occurred.');
            }
            return $q.reject(response.data);
        }
    }
})();
'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name eureka.register.RegisterService
     * @description
     * This service provides an API to interact with the REST endpoint for registration.
     * @requires $http
     * @requires $q
     */

    angular.module('eureka.register').factory('RegisterService');

    RegisterService.$inject = ['$http', '$q'];

    function RegisterService($http, $q) {

        return {
            addNewAccount: addNewAccount
        };

        function addNewAccount(newAccount) {
            newAccount.username = newAccount.email;
            newAccount.fullName = newAccount.firstName + ' ' + newAccount.lastName;
            newAccount.type = 'LOCAL';
            newAccount.loginType = 'INTERNAL';
            return $http.post('/eureka-services/api/userrequest/new', newAccount).then(handleSuccess, handleError);
        }

        function handleSuccess(response) {
            return response.data;
        }

        function handleError(response) {
            if (!angular.isObject(response.data) && !response.data) {
                return $q.reject('An unknown error occurred.');
            }
            return $q.reject(response.data);
        }
    }
})();
'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc controller
     * @name eureka.cohorts.controller:EditCtrl
     * @description
     * This is the edit controller for the cohorts section of the application.
     * @requires cohorts.CohortService
     * @requires $stateParams
     */

    angular.module('eureka.cohorts').controller('cohorts.EditCtrl', EditCtrl);

    EditCtrl.$inject = ['CohortService', '$stateParams'];

    function EditCtrl(CohortService, $stateParams) {
        var vm = this;

        if ($stateParams.key) {

            CohortService.getCohort($stateParams.key).then(function (data) {
                vm.destination = data;
                getPhenotypes(data);
            }, displayError);
        }

        function getPhenotypes(data) {
            CohortService.getPhenotypes(data.cohort).then(function (promises) {

                var phenotypes = [];
                for (var i = 0; i < promises.length; i++) {
                    phenotypes.push(new Object({
                        dataElementKey: promises[i].data.key,
                        dataElementDisplayName: promises[i].data.displayName,
                        type: 'SYSTEM'
                    }));
                }

                vm.destination.phenotypes = phenotypes;

                eureka.editor.setup(data.id !== null ? data.id : null, '#userTree', '#definitionContainer', '#savePropositionButton');
            });
        }

        function displayError(msg) {
            vm.errorMsg = msg;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc controller
     * @name eureka.cohorts.controller:MainCtrl
     * @description
     * This is the main controller for the cohorts section of the application.
     * @requires cohorts.CohortService
     */

    angular.module('eureka.cohorts').controller('cohorts.MainCtrl', MainCtrl);

    MainCtrl.$inject = ['CohortService'];

    function MainCtrl(CohortService) {
        var vm = this;
        vm.remove = remove;
        getCohorts();

        function getCohorts() {
            CohortService.getCohorts().then(function (data) {
                vm.list = data;
            }, displayError);
        }

        function remove(key) {
            CohortService.removeCohort(key);
            for (var i = 0; i < vm.list.length; i++) {
                if (vm.list[i].name === key) {
                    vm.list.splice(i, 1);
                    break;
                }
            }
        }

        function displayError(msg) {
            vm.errorMsg = msg;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc controller
     * @name eureka.cohorts.controller:NewCtrl
     * @description
     * This is the new controller for the cohorts section of the application.
     */

    angular.module('eureka.cohorts').controller('cohorts.NewCtrl', NewCtrl);

    NewCtrl.$inject = [];

    function NewCtrl() {}
})();
'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name eureka.phenotypes.directive:phenotypeEditor
     * @element *
     * @function
     * @description
     * Phenotype editor directive.
     * @requires $http
     * @requires $templateCache
     * @requires $timeout
     * @requires eureka.listDragAndDropService
     */

    angular.module('eureka.phenotypes').directive('phenotypeEditor', phenotypeEditor);

    phenotypeEditor.$inject = ['$http', '$templateCache', '$timeout', 'listDragAndDropService'];

    function phenotypeEditor(http, templateCache, timer, listDragAndDropService) {

        return {
            scope: {
                item: '=phenotypeEditor'
            },
            replace: true,
            restrict: 'EA',
            templateUrl: 'eureka/phenotypes/directives/phenotype-editor/phenotype-editor.html',
            link: function link(scope, element, attrs, ctrl, transclude) {
                scope.$watch('$last', function (v) {
                    var editorAction = function editorAction() {

                        $('ul.sortable').each(function (i, list) {
                            $(list).find('li').each(function (j, item) {
                                listDragAndDropService.addDroppedElement(item, $(list));
                            });

                            $('span.delete-icon').each(function (i, item) {
                                $(item).click(function () {
                                    var $toRemove = $(item).closest('li');
                                    var $sortable = $toRemove.closest('ul.sortable');
                                    var dialog = $('#deleteModal');
                                    $(dialog).find('#deleteContent').html('Are you sure you want to remove ' + 'data element &quot;' + $toRemove.text().trim() + '&quot;?');
                                    $(dialog).find('#deleteButton').on('click', function (e) {
                                        listDragAndDropService.deleteItem($toRemove, $sortable, 0);
                                        $(dialog).modal('hide');
                                    });
                                    $(dialog).modal('show');
                                });
                            });
                        });
                        var parent = element.parent();
                        if (parent.is('div')) {
                            parent.append($('<ul></ul>').attr('data-drop-type', 'multiple').attr('data-proptype', 'empty').addClass('sortable').append(element.parent().children()));
                        }
                    };

                    timer(editorAction, 0);
                });
            }
        };
    }
})();
'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc controller
     * @name eureka.phenotypes.controller:MainCtrl
     * @description
     * This is the main controller for the phenotypes section of the application.
     * @requires $scope
     * @requires $location
     * @requires eureka.phenotypes.PhenotypeService
     */

    angular.module('eureka.phenotypes').controller('phenotypes.MainCtrl');

    MainCtrl.$inject = ['$scope', 'PhenotypeService', '$location'];

    function MainCtrl($scope, PhenotypeService, $location) {

        var vm = this;
        var messages = {
            'CATEGORIZATION': {
                'displayName': 'Category',
                'description': 'For defining a significant category of codes or clinical events or observations.'
            },
            'TEMPORAL': {
                'displayName': 'Temporal',
                'description': 'For defining a disease, finding or patient care process to be reflected by codes,\n                clinical events and/or observations in a specified frequency, sequential or other temporal patterns.'
            },
            'SEQUENCE': {
                'displayName': 'Sequence',
                'description': 'For defining a disease, finding or patient care process to be reflected by codes,\n                clinical events and/or observations in a specified sequential temporal pattern.'
            },
            'FREQUENCY': {
                'displayName': 'Frequency',
                'description': 'For defining a disease, finding or patient care process to be reflected by codes,\n                clinical events and/or observations in a specified frequency.'
            },
            'VALUE_THRESHOLD': {
                'displayName': 'Value Threshold',
                'description': 'For defining clinically significant thresholds on the value of an observation.'
            }
        };
        vm.messages = messages;

        PhenotypeService.getSummarizedUserElements().then(function (data) {
            vm.props = data;
        }, displayError);

        function displayError(msg) {
            vm.errorMsg = msg;
        }

        /*
         passwordChange.error.internalServerError=Error while changing password.
        deleteDataElement.error.internalServerError=Error trying to delete data element.
        There is a problem with Eureka!.
        registerUserServlet.fullName={0} {1}
        registerUserServlet.error.unspecified=Please contact {0} for assistance.
        registerUserServlet.error.localAccountConflict=An account with your email address already exists.
         */
    }
})();
'use strict';

(function () {
    'use strict';

    /**
     * @ngdoc controller
     * @name eureka.register.controller:MainCtrl
     * @description
     * This is the main controller for the register section of the application.
     * @requires $location
     * @requires eureka.register.RegisterService
     */

    angular.module('eureka.register').controller('register.MainCtrl', MainCtrl);

    MainCtrl.$inject = ['RegisterService', '$location'];

    function MainCtrl(RegisterService, $location) {
        var vm = this;
        vm.addNewAccount = addNewAccount;

        function addNewAccount(newAccount) {
            RegisterService.addNewAccount(newAccount).then(handleSuccess, displayError);
        }

        function handleSuccess(data) {
            vm.showSuccess = true;
        }

        function displayError(msg) {
            vm.errorMsg = msg;
        }
    }
})();
//# sourceMappingURL=app.js.map