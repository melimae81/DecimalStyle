define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "dojo/text!DecimalStyle/widget/template/DecimalStyle.html"


], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, widgetTemplate) {
    "use strict";

    return declare("DecimalStyle.widget.DecimalStyle", [_WidgetBase, _TemplatedMixin], {


        templateString: widgetTemplate,
        widgetBase: null,

        //nodes
        beforeNode: null,
        afterNode: null,
        decimalNode: null,
        field: null,
        beforeClassName: null,
        afterClassName: null,
        onclickMicroflow: null,

        // Internal variables.
        _handles: null,
        _contextObj: null,

        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
            this._setupEvents();
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering(callback);
        },

        _setupEvents: function () {
            this.connect(this.domNode, "onclick", function () {
                mx.data.action({
                    params: {
                        applyto: "selection",
                        actionname: this.onclickMicroflow,
                        guids: [this._contextObj.getGuid()]
                    },
                    origin: this.mxform,
                    callback: function (obj) {
                        // no MxObject expected
                        console.log("microflow ran successfully")
                    },
                    error: function (error) {
                        alert(error.message);
                    },
                    onValidation: function (validations) {
                        alert("There were " + validation.length + " validation errors");
                    }
                });
            });
        },

        _resetSubscriptions: function () {
            this.unsubscribeAll();
            //add an attribute subscription
            this.subscribe({
                guid: this._contextObj.getGuid(),
                attr: this.field,
                callback: this._updateRendering
            }),
                this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: this._updateRendering
                })
            //add object subscription
        },
        resize: function (box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
                var value = "" + this._contextObj.get(this.field) * 1;
                var splitValues = value.split(".");
                this.beforeNode.innerHTML = splitValues[0];
                this.beforeNode.className += " " + this.beforeClassName;
                this.afterNode.innerHTML = splitValues[1];
                this.afterNode.className += " " + this.afterClassName;
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback, "_updateRendering");
        },

        // Shorthand for running a microflow
        _execMf: function (mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
                    },
                    callback: lang.hitch(this, function (objs) {
                        if (cb && typeof cb === "function") {
                            cb(objs);
                        }
                    }),
                    error: function (error) {
                        console.debug(error.description);
                    }
                }, this);
            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["DecimalStyle/widget/DecimalStyle"]);
