var rangeInputs = [];
var dateRangeInputs = [];
var rangeSliderInputs = [];

var wspHelper = (function () {
    "use strict";

    var Constructor = function (selector) {
        if (!selector) return;
        this.selector = selector;
        this.elems = $(selector);
    };

    Constructor.prototype.ToJson = function (json) {
        json = json.replace(/&quot;/g, '"');
        return JSON.parse(json);
    };
    Constructor.prototype.makeAsyncDataSource = function (url) {
        return new DevExpress.data.CustomStore({
            loadMode: "raw",
            key: "ID",
            load: function () {
                return $.getJSON(url);
            }
        });
    };
    Constructor.prototype.getResult = function (url, callback, errorCallback, beforeCallback, completeCallback) {
        $.ajax({
            url: url,
            type: "post",
            success: function (data) {
                if (typeof callback !== "undefined")
                    callback(data);
            },
            error: function (ex) {
                if (typeof errorCallback !== "undefined")
                    errorCallback(ex);
            },
            beforeSend: function (data) {
                if (typeof beforeCallback !== "undefined")
                    beforeCallback(data);
            },
            complete: function (data) {
                if (typeof completeCallback !== "undefined")
                    completeCallback(data);
            }
        });
    };
    Constructor.prototype.tryParseInt = function (str, defaultValue) {
        var retValue = defaultValue;
        if (str) {
            if (str.length > 0) {
                if (!isNaN(str)) {
                    retValue = parseInt(str);
                }
            }
        }
        return retValue;
    };

    //Popups
    //-------------------------------------------------------------------------------
    Constructor.prototype.popup = function (icon, title, message, complete) {
        swal({
            title: title,
            text: message,
            icon: icon
        }).then((result) => {
            if (typeof complete !== "undefined")
                complete(result);
        });
        return this;
    };
    Constructor.prototype.successPopup = function (title, message, complete) {
        return this.popup("success", title, message, complete);
    };
    Constructor.prototype.errorPopup = function (title, message, complete) {
        return this.popup("error", title, message, complete);
    };
    Constructor.prototype.warningPopup = function (title, message, complete) {
        return this.popup("warning", title, message, complete);
    };
    Constructor.prototype.neutralPopup = function (title, message, complete) {
        return this.popup("", title, message, complete);
    };

    Constructor.prototype.popupApprove = function (icon, title, message, complete) {
        swal({
            title: title,
            text: message,
            buttons: true,
            icon: icon
        }).then((result) => {
            if (typeof complete !== "undefined")
                complete(result);
        });

        return this;
    };

    Constructor.prototype.successPopupApprove = function (title, message, complete) {
        return this.popupApprove("success", title, message, complete);
    };
    Constructor.prototype.errorPopupApprove = function (title, message, complete) {
        return this.popupApprove("error", title, message, complete);
    };
    Constructor.prototype.warningPopupApprove = function (title, message, complete) {
        return this.popupApprove("warning", title, message, complete);
    };
    Constructor.prototype.neutralPopupApprove = function (title, message, complete) {
        return this.popupApprove("", title, message, complete);
    };

    var instantiate = function (selector, type, opt, opt1, opt2, opt3) {
        var constructor = new Constructor(selector);
        switch (selector) {
            case "popup":
                switch (type) {
                    case "success":
                        return constructor.successPopup(opt, opt1, opt2, opt3);
                    case "warning":
                        return constructor.warningPopup(opt, opt1, opt2, opt3);
                    case "error":
                        return constructor.errorPopup(opt, opt1, opt2, opt3);
                }
                break;
            case "style":
                return constructor.editorStylingMode(type);
            case "json":
                return constructor.ToJson(type);
            case "datasource":
                return constructor.makeAsyncDataSource(type);
        }
        return constructor;
    };

    return instantiate;
})();
var helper = wspHelper();

var wsp = (function () {
    "use strict";

    var Constructor = function (selector) {
        if (!selector) return;
        this.selector = selector;
        this.elems = $(selector);
    };

    //DevExtreme Form Controls
    //-------------------------------------------------------------------------------
    Constructor.prototype.textBox = function (options) {
        var control = wspDX(this.selector, "text", options);
        return control;
    };
    Constructor.prototype.emailTextBox = function (message, options) {
        var control = this.textBox(options);
        control.addEmailValidator(message);
        return control;
    };
    Constructor.prototype.passwordTextBox = function (options) {
        var control = this.textBox(options);
        control.mode("password");
        return control;
    };
    Constructor.prototype.textarea = function (options) {
        var control = wspDX(this.selector, "textarea", options);
        return control;
    };
    Constructor.prototype.autocomplete = function (options) {
        var control = wspDX(this.selector, "autocomplete", options);
        return control;
    };
    Constructor.prototype.numberBox = function (options) {
        var control = wspDX(this.selector, "number", options);
        return control;
    };
    Constructor.prototype.selectBox = function (options) {
        var control = wspDX(this.selector, "select", options);
        return control;
    };
    Constructor.prototype.dropDownBox = function (options) {
        var control = wspDX(this.selector, "dropdown", options);
        return control;
    };
    Constructor.prototype.tagBox = function (options) {
        var control = wspDX(this.selector, "tagBox", options);
        return control;
    };
    Constructor.prototype.checkBox = function (options) {
        var control = wspDX(this.selector, "check", options);
        return control;
    };
    Constructor.prototype.radio = function (options) {
        var control = wspDX(this.selector, "radio", options);
        return control;
    };
    Constructor.prototype.switch = function (options) {
        var control = wspDX(this.selector, "switch", options);
        return control;
    };
    Constructor.prototype.button = function (options) {
        var control = wspDX(this.selector, "button", options);
        return control;
    };
    Constructor.prototype.range = function (options) {
        var control = wspDX(this.selector, "range", options);
        return control;
    };
    Constructor.prototype.daterange = function (options) {
        var control = wspDX(this.selector, "daterange", options);
        return control;
    };
    Constructor.prototype.rangeSlider = function (options) {
        var control = wspDX(this.selector, "rangeSlider", options);
        return control;
    };
    Constructor.prototype.slider = function (options) {
        var control = wspDX(this.selector, "slider", options);
        return control;
    };
    Constructor.prototype.htmlEditor = function (options) {
        if (!options)
            options = {
                toolbar: {
                    items: [
                        "undo", "redo", "separator",
                        {
                            formatName: "size",
                            formatValues: ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"]
                        },
                        {
                            formatName: "font",
                            formatValues: ["Arial", "Courier New", "Georgia", "Impact", "Lucida Console", "Tahoma", "Times New Roman", "Verdana"]
                        },
                        "separator", "bold", "italic", "strike", "underline", "separator",
                        "alignLeft", "alignCenter", "alignRight", "alignJustify", "separator",
                        {
                            formatName: "header",
                            formatValues: [false, 1, 2, 3, 4, 5]
                        }, "separator",
                        "orderedList", "bulletList", "separator",
                        "color", "background", "separator",
                        "link", "image", "separator",
                        "clear", "codeBlock", "blockquote"
                    ]
                }
            };

        var control = wspDX(this.selector, "editor", options);
        return control;
    };
    Constructor.prototype.datePicker = function (options) {
        var control = wspDX(this.selector, "date", options);
        return control;
    };
    Constructor.prototype.colorBox = function (options) {
        var control = wspDX(this.selector, "color", options);
        return control;
    };
    Constructor.prototype.fileUploader = function (options) {
        var control = wspDX(this.selector, "file", options);
        return control;
    };
    Constructor.prototype.validationSummary = function (options) {
        var control = wspDX(this.selector, "validation", options);
        return control;
    };

    //DevExtreme Data Grids
    //-------------------------------------------------------------------------------
    Constructor.prototype.tableAsync = function (url, columns) {
        var list = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var deferred = $.Deferred();
                $.ajax({
                    url: url,
                    dataType: "json",
                    type: "post",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(loadOptions),
                    success: function (result) {
                        deferred.resolve(result.items, { totalCount: result.totalCount });
                    },
                    error: function () {
                        deferred.reject("Data Loading Error");
                    },
                    timeout: 20000
                });

                return deferred.promise();
            }
        });

        var options = {
            dataSource: {
                store: list
            },
            paging: {
                pageSize: 10
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 25, 50, 100]
            },
            remoteOperations: {
                sorting: true,
                paging: true
            },
            searchPanel: {
                visible: true,
                highlightCaseSensitive: true
            },
            groupPanel: { visible: true },
            grouping: {
                autoExpandAll: true
            },
            allowColumnReordering: true,
            rowAlternationEnabled: true,
            showBorders: true,
            showColumnLines: false,
            showRowLines: true,
            columns: columns
        };

        var instance = this.elems.dxDataGrid(options);
        var control = wspDX(instance, "tableAsync");
        return control;
    };
    Constructor.prototype.table = function (url, columns, summary) {
        var constructor = this;
        helper.getResult(url, function (data) {
            var options = {
                paging: {
                    pageSize: 10
                },
                pager: {
                    showPageSizeSelector: true,
                    allowedPageSizes: [10, 25, 50, 100]
                },
                remoteOperations: false,
                searchPanel: {
                    visible: true,
                    highlightCaseSensitive: true
                },
                groupPanel: { visible: true },
                grouping: {
                    autoExpandAll: true
                },
                allowColumnReordering: true,
                rowAlternationEnabled: true,
                showBorders: true,
                showColumnLines: false,
                showRowLines: true
            };

            if (typeof summary !== "undefined")
                options.summary = summary;

            if (typeof columns !== "undefined")
                options.columns = columns;

            options.dataSource = data;
            var instance = constructor.elems.dxDataGrid(options);
            var control = wspDX(instance, "table");
            return control;
        });
    };
    Constructor.prototype.viewBagTable = function (data, columns, summary) {
        var constructor = this;
        var options = {
            paging: {
                pageSize: 10
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 25, 50, 100]
            },
            remoteOperations: false,
            searchPanel: {
                visible: true,
                highlightCaseSensitive: true
            },
            groupPanel: { visible: true },
            grouping: {
                autoExpandAll: true
            },
            allowColumnReordering: true,
            rowAlternationEnabled: true,
            showBorders: true,
            showColumnLines: false,
            showRowLines: true
        };

        if (typeof summary !== "undefined")
            options.summary = summary;

        if (typeof columns !== "undefined")
            options.columns = columns;

        options.dataSource = data;
        var instance = constructor.elems.dxDataGrid(options);
        var control = wspDX(instance, "table");
        return control;
    };

    //DevExtreme Async Form 
    //-------------------------------------------------------------------------------
    Constructor.prototype.submitAsAjax = function (options) {
        var constructor = this;
        this.elems.submit(function (e) {
            e.preventDefault();

            if (typeof options.before !== "undefined")
                options.before();

            constructor.escapeHtml();
            constructor.addRangeInput();
            var data = constructor.elems.serialize();
            $.ajax({
                url: options.url,
                type: "POST",
                data: data,
                success: function (result) {
                    if (typeof options.success !== "undefined")
                        options.success(result);
                },
                error: function (ex) {
                    if (typeof options.error !== "undefined")
                        options.error(ex);
                },
                complete: function (result) {
                    constructor.removeExtraKeys();
                    constructor.unescapeHtml();

                    if (typeof options.complete !== "undefined")
                        options.complete(result);
                }
            });
        });

        return this;
    };
    Constructor.prototype.addKey = function (key, value) {
        $("<input />").attr("type", "hidden")
            .attr("data-input", "extra-field")
            .attr("name", key)
            .attr("value", value)
            .appendTo(this.elems);

        return this;
    };
    Constructor.prototype.changeKey = function (key, value) {
        $("input[name=" + key + "]").val(value);
        return this;
    };
    Constructor.prototype.removeExtraKeys = function () {
        this.elems.find("[data-input='extra-field']").each(function () {
            $(this).remove();
        });
        return this;
    };
    Constructor.prototype.escapeHtml = function () {
        this.elems.find("textarea").each(function () {
            var val = $(this).val();
            $(this).val(escape(val));
        });
        return this;
    };
    Constructor.prototype.unescapeHtml = function () {
        this.elems.find("textarea").each(function () {
            var val = $(this).val();
            $(this).val(unescape(val));
        });
        return this;
    };
    Constructor.prototype.addRangeInput = function () {
        var constructor = this;
        var i;
        var j;
        for (i = 0; i < rangeInputs.length; i++) {
            var values = $(rangeInputs[i]).dxRangeSelector("instance").option("value");
            var name = $(rangeInputs[i]).dxRangeSelector("instance").option("name");
            if (values) {
                for (j = 0; j < values.length; j++) {
                    constructor.addKey(name, values[j]);
                }
            }
        }
        for (i = 0; i < dateRangeInputs.length; i++) {
            var dateValues = $(dateRangeInputs[i]).dxRangeSelector("instance").option("value");
            var dateName = $(dateRangeInputs[i]).dxRangeSelector("instance").option("name");
            if (dateValues) {
                for (j = 0; j < dateValues.length; j++) {
                    constructor.addKey(dateName, formatDateTime(dateValues[j]));
                }
            }
        }
        for (i = 0; i < rangeSliderInputs.length; i++) {
            var sliderValues = $(rangeSliderInputs[i]).dxRangeSlider("instance").option("value");
            var sliderName = $(rangeSliderInputs[i]).dxRangeSlider("instance").option("name");
            if (sliderValues) {
                for (j = 0; j < sliderValues.length; j++) {
                    constructor.addKey(sliderName, sliderValues[j]);
                }
            }
        }

        return this;
    };

    //Style
    //-------------------------------------------------------------------------------
    Constructor.prototype.editorStylingMode = function (style) {
        DevExpress.config({
            editorStylingMode: style
        });

        return this;
    };

    var instantiate = function (selector, type, opt, opt1, opt2, opt3) {
        var constructor = new Constructor(selector);
        switch (selector) {
            case "popup":
                switch (type) {
                    case "success":
                        return helper.successPopup(opt, opt1, opt2);
                    case "warning":
                        return helper.warningPopup(opt, opt1, opt2);
                    case "error":
                        return helper.errorPopup(opt, opt1, opt2);
                    case "neutral":
                        return helper.neutralPopup(opt, opt1, opt2);
                }
                break;
            case "popup-approve":
                switch (type) {
                    case "success":
                        return helper.successPopupApprove(opt, opt1, opt2, opt3);
                    case "warning":
                        return helper.warningPopupApprove(opt, opt1, opt2, opt3);
                    case "error":
                        return helper.errorPopupApprove(opt, opt1, opt2, opt3);
                    case "neutral":
                        return helper.neutralPopupApprove(opt, opt1, opt2, opt3);
                }
                break;
            case "style":
                return helper.editorStylingMode(type);
            case "json":
                return helper.ToJson(type);
            case "datasource":
                return helper.makeAsyncDataSource(type);
        }

        if (type) {
            switch (type) {
                case "text":
                    return constructor.textBox(opt);
                case "email":
                    return constructor.emailTextBox(opt, opt1);
                case "password":
                    return constructor.passwordTextBox(opt);
                case "textarea":
                    return constructor.textarea(opt);
                case "number":
                    return constructor.numberBox(opt);
                case "check":
                    return constructor.checkBox(opt);
                case "switch":
                    return constructor.switch(opt);
                case "select":
                    return constructor.selectBox(opt);
                case "dropdown":
                    return constructor.dropDownBox(opt);
                case "tagBox":
                    return constructor.tagBox(opt);
                case "button":
                    return constructor.button(opt);
                case "validation":
                    return constructor.validationSummary(opt);
                case "editor":
                    return constructor.htmlEditor(opt);
                case "ajax":
                    return constructor.submitAsAjax(opt);
                case "autocomplete":
                    return constructor.autocomplete(opt);
                case "date":
                    return constructor.datePicker(opt);
                case "radio":
                    return constructor.radio(opt);
                case "range":
                    return constructor.range(opt);
                case "daterange":
                    return constructor.daterange(opt);
                case "rangeSlider":
                    return constructor.rangeSlider(opt);
                case "slider":
                    return constructor.slider(opt);
                case "color":
                    return constructor.colorBox(opt);
                case "file":
                    return constructor.fileUploader(opt);
                case "table":
                    if (typeof (opt) === "string")
                        return constructor.table(opt, opt1, opt2);
                    else
                        return constructor.viewBagTable(opt, opt1, opt2);

                case "tableAsync":
                    return constructor.tableAsync(opt, opt1);
            }
        }

        return constructor;
    };

    return instantiate;
})();

var wspDX = (function () {
    "use strict";

    var Constructor = function (selector, type, options) {
        if (!selector) return;
        this.selector = selector;
        this.element = $(selector);
        this.elementType = type;
        this.validationRules = [];
        this.onValueChangedEvents = [];
        if (options)
            this.options = options;
        else
            this.options = {};

        var c;
        switch (this.elementType) {
            case "text":
            case "email":
            case "password":
                if (typeof this.options.value === "undefined")
                    this.options.value = this.element.html();

                this.instance = this.element.dxTextBox(options);
                break;
            case "textarea":
                if (typeof this.options.value === "undefined")
                    this.options.value = unescape(this.element.html());

                this.instance = this.element.dxTextArea(options);
                break;
            case "number":
                if (typeof this.options.value === "undefined") {
                    c = tryParseInt(this.element.html(), null);
                    if (c) {
                        this.options.value = c;
                    }
                }

                this.instance = this.element.dxNumberBox(options);
                break;
            case "check":
                if (typeof this.options.value === "undefined")
                    this.options.value = this.element.html() === "true";

                this.instance = this.element.dxCheckBox(options);
                break;
            case "select":
                if (typeof this.options.value === "undefined") {
                    c = tryParseInt(this.element.html(), null);
                    if (c) {
                        this.options.value = c;
                    }
                }
                this.instance = this.element.dxSelectBox(options);
                break;
            case "tagBox":
                if (typeof this.options.value === "undefined")
                    this.options.value = this.element.html();

                this.instance = this.element.dxTagBox(options);
                break;
            case "switch":
                if (typeof this.options.value === "undefined")
                    this.options.value = this.element.html() === "true";

                this.instance = this.element.dxSwitch(options);
                break;
            case "dropdown":
                if (typeof this.options.value === "undefined") {
                    c = tryParseInt(this.element.html(), null);
                    if (c) {
                        this.options.value = c;
                    }
                }

                this.instance = this.element.dxDropDownBox(options);
                break;
            case "autocomplete":
                if (typeof this.options.value === "undefined")
                    this.options.value = this.element.html();

                this.instance = this.element.dxAutocomplete(options);
                break;
            case "date":
                if (typeof this.options.value === "undefined")
                    this.options.value = this.element.html();

                this.instance = this.element.dxDateBox(options);
                break;
            case "radio":
                if (typeof this.options.value === "undefined")
                    this.options.value = this.element.html();

                this.instance = this.element.dxRadioGroup(options);
                break;
            case "range":
            case "daterange":
                this.instance = this.element.dxRangeSelector(options);
                break;
            case "rangeSlider":
                this.instance = this.element.dxRangeSlider(options);
                break;
            case "slider":
                if (typeof this.options.value === "undefined")
                    this.options.value = this.element.html();

                this.instance = this.element.dxSlider(options);
                break;
            case "color":
                if (typeof this.options.value === "undefined")
                    this.options.value = this.element.html();

                this.instance = this.element.dxColorBox(options);
                break;
            case "file":
                this.instance = this.element.dxFileUploader(options);
                break;
            case "table":
            case "tableAsync":
                this.instance = this.element.dxDataGrid(options);
                break;
            case "validation":
                this.instance = this.element.dxValidationSummary(options);
                break;
            case "editor":
                if (typeof this.options.value === "undefined")
                    options.value = unescape(this.element.html());

                this.instance = this.element.dxHtmlEditor(options);
                break;
            case "button":
                this.instance = this.element.dxButton(options);
                break;
        }
    };

    //Functions
    Constructor.prototype.subscribe = function (onValueChangedEvent) {
        var constructor = this;
        this.onValueChangedEvents.push(onValueChangedEvent);
        this.onValueChanged(function () {
            for (var i = 0; i < constructor.onValueChangedEvents.length; i++) {
                constructor.onValueChangedEvents[i]();
            }
        });
        return this;
    };
    Constructor.prototype.showIf = function (control, value) {
        var constructor = this;

        this.targetControl = control;
        this.targetValue = value;

        control.subscribe(function () {
            constructor.showHide();
        });
        constructor.showHide();
        return this;
    };
    Constructor.prototype.showHide = function () {
        if (this.targetControl) {
            var val = this.targetControl.value();
            if (val === this.targetValue) {
                this.instance.show();
            } else {
                this.instance.hide();
            }
        }
        return this;
    };
    Constructor.prototype.addRule = function (rule) {
        this.validationRules.push(rule);
        this.instance.dxValidator({
            validationRules: this.validationRules
        });

        return this;
    };
    Constructor.prototype.required = function (message) {
        this.addRule({
            type: "required",
            message: message
        });
        return this;
    };
    Constructor.prototype.addEmailValidator = function (message) {
        this.addRule({
            type: "email",
            message: message
        });
        return this;
    };
    Constructor.prototype.USAPhonePatternValidator = function (message) {
        this.addRule({
            type: "pattern",
            pattern: /^\+\s*1\s*\(\s*[02-9]\d{2}\)\s*\d{3}\s*-\s*\d{4}$/,
            message: message
        });
        return this;
    };
    Constructor.prototype.patternValidator = function (pattern, message) {
        this.addRule({
            type: "pattern",
            pattern: pattern,
            message: message
        });
        return this;
    };
    Constructor.prototype.stringLengthValidator = function (length, message) {
        this.addRule({
            type: "stringLength",
            min: length,
            message: message
        });
        return this;
    };
    Constructor.prototype.compare = function (comparisonTarget, message) {
        this.addRule({
            type: "compare",
            comparisonTarget: comparisonTarget,
            message: message
        });
        return this;
    };
    Constructor.prototype.compareTarget = function (target, message) {
        this.addRule({
            type: "compare",
            comparisonTarget: function () {
                var password = $(target).dxTextBox("instance");
                if (password) {
                    return password.option("value");
                }
                return "";
            },
            message: message
        });
        return this;
    };
    Constructor.prototype.phoneMask = function (message) {
        this.mask("+1 (X00) 000-0000")
            .maskRules({ "X": /[02-9]/ })
            .maskInvalidMessage(message)
            .useMaskedValue(true);
        return this;
    };
    Constructor.prototype.show = function () {
        this.element.closest(".form-field").show();
        return this;
    };
    Constructor.prototype.hide = function () {
        this.element.closest(".form-field").hide();
        return this;
    };
    Constructor.prototype.enable = function () {
        return this.addOption("disabled", false);
    };
    Constructor.prototype.disable = function () {
        return this.addOption("disabled", true);
    };

    //Options
    Constructor.prototype.addOption = function (key, value) {
        this.options[key] = value;
        switch (this.elementType) {
            case "text":
            case "email":
            case "password":
                if (typeof value !== "undefined") {
                    this.instance.dxTextBox(this.options);
                } else {
                    return this.instance.dxTextBox("instance").option(key);
                }
                break;
            case "textarea":
                if (typeof value !== "undefined") {
                    this.instance.dxTextArea(this.options);
                } else {
                    return this.instance.dxTextArea("instance").option(key);
                }
                break;
            case "number":
                if (typeof value !== "undefined") {
                    this.instance.dxNumberBox(this.options);
                } else {
                    return this.instance.dxNumberBox("instance").option(key);
                }
                break;
            case "check":
                if (typeof value !== "undefined") {
                    this.instance.dxCheckBox(this.options);
                } else {
                    return this.instance.dxCheckBox("instance").option(key);
                }
                break;
            case "select":
                if (typeof value !== "undefined") {
                    this.instance.dxSelectBox(this.options);
                } else {
                    return this.instance.dxSelectBox("instance").option(key);
                }
                break;
            case "tagBox":
                if (typeof value !== "undefined") {
                    this.instance.dxTagBox(this.options);
                } else {
                    return this.instance.dxTagBox("instance").option(key);
                }
                break;
            case "button":
                if (typeof value !== "undefined") {
                    this.instance.dxButton(this.options);
                } else {
                    return this.instance.dxButton("instance").option(key);
                }
                break;
            case "validation":
                if (typeof value !== "undefined") {
                    this.instance.dxValidationSummary(this.options);
                } else {
                    return this.instance.dxValidationSummary("instance").option(key);
                }
                break;
            case "editor":
                if (typeof value !== "undefined") {
                    this.instance.dxHtmlEditor(this.options);
                } else {
                    return this.instance.dxHtmlEditor("instance").option(key);
                }
                break;
            case "switch":
                if (typeof value !== "undefined") {
                    this.instance.dxSwitch(this.options);
                } else {
                    return this.instance.dxSwitch("instance").option(key);
                }
                break;
            case "dropdown":
                if (typeof value !== "undefined") {
                    this.instance.dxDropDownBox(this.options);
                } else {
                    return this.instance.dxDropDownBox("instance").option(key);
                }
                break;
            case "autocomplete":
                if (typeof value !== "undefined") {
                    this.instance.dxAutocomplete(this.options);
                } else {
                    return this.instance.dxAutocomplete("instance").option(key);
                }
                break;
            case "date":
                if (typeof value !== "undefined") {
                    this.instance.dxDateBox(this.options);
                } else {
                    return this.instance.dxDateBox("instance").option(key);
                }
                break;
            case "radio":
                if (typeof value !== "undefined") {
                    this.instance.dxRadioGroup(this.options);
                } else {
                    return this.instance.dxRadioGroup("instance").option(key);
                }
                break;
            case "range":
            case "daterange":
                if (typeof value !== "undefined") {
                    this.instance.dxRangeSelector(this.options);
                } else {
                    return this.instance.dxRangeSelector("instance").option(key);
                }
                break;
            case "rangeSlider":
                if (typeof value !== "undefined") {
                    this.instance.dxRangeSlider(this.options);
                } else {
                    return this.instance.dxRangeSlider("instance").option(key);
                }
                break;
            case "slider":
                if (typeof value !== "undefined") {
                    this.instance.dxSlider(this.options);
                } else {
                    return this.instance.dxSlider("instance").option(key);
                }
                break;
            case "color":
                if (typeof value !== "undefined") {
                    this.instance.dxColorBox(this.options);
                } else {
                    return this.instance.dxColorBox("instance").option(key);
                }
                break;
            case "file":
                if (typeof value !== "undefined") {
                    this.instance.dxFileUploader(this.options);
                } else {
                    return this.instance.dxFileUploader("instance").option(key);
                }
                break;
            case "table":
            case "tableAsync":
                if (typeof value !== "undefined") {
                    this.instance.dxDataGrid(this.options);
                } else {
                    return this.instance.dxDataGrid("instance").option(key);
                }
                break;
        }
        return this;
    };
    Constructor.prototype.value = function (value) {
        return this.addOption("value", value);
    };
    Constructor.prototype.name = function (value) {
        return this.addOption("name", value);
    };
    Constructor.prototype.text = function (value) {
        return this.addOption("text", value);
    };
    Constructor.prototype.placeholder = function (value) {
        return this.addOption("placeholder", value);
    };
    Constructor.prototype.min = function (value) {
        return this.addOption("min", value);
    };
    Constructor.prototype.max = function (value) {
        return this.addOption("max", value);
    };
    Constructor.prototype.mode = function (value) {
        return this.addOption("mode", value);
    };
    Constructor.prototype.dataSource = function (value) {
        return this.addOption("dataSource", value);
    };
    Constructor.prototype.onValueChanged = function (value) {
        return this.addOption("onValueChanged", value);
    };
    Constructor.prototype.showClearButton = function (value) {
        return this.addOption("showClearButton", value);
    };
    Constructor.prototype.mask = function (value) {
        return this.addOption("mask", value);
    };
    Constructor.prototype.maskRules = function (value) {
        return this.addOption("maskRules", value);
    };
    Constructor.prototype.maskInvalidMessage = function (value) {
        return this.addOption("maskInvalidMessage", value);
    };
    Constructor.prototype.useMaskedValue = function (value) {
        return this.addOption("useMaskedValue", value);
    };
    Constructor.prototype.format = function (value) {
        return this.addOption("format", value);
    };
    Constructor.prototype.step = function (value) {
        return this.addOption("step", value);
    };
    Constructor.prototype.showSpinButtons = function (value) {
        return this.addOption("showSpinButtons", value);
    };
    Constructor.prototype.submitBehaviour = function (value) {
        return this.addOption("submitBehaviour", value);
    };
    Constructor.prototype.type = function (value) {
        return this.addOption("type", value);
    };
    Constructor.prototype.height = function (value) {
        return this.addOption("height", value);
    };
    Constructor.prototype.width = function (value) {
        return this.addOption("width", value);
    };
    Constructor.prototype.displayExpr = function (value) {
        return this.addOption("displayExpr", value);
    };
    Constructor.prototype.valueExpr = function (value) {
        return this.addOption("valueExpr", value);
    };
    Constructor.prototype.items = function (value) {
        return this.addOption("items", value);
    };
    Constructor.prototype.searchEnabled = function (value) {
        return this.addOption("searchEnabled", value);
    };
    Constructor.prototype.showSelectionControls = function (value) {
        return this.addOption("showSelectionControls", value);
    };
    Constructor.prototype.hideSelectedItems = function (value) {
        return this.addOption("hideSelectedItems", value);
    };
    Constructor.prototype.applyValueMode = function (value) {
        return this.addOption("applyValueMode", value);
    };
    Constructor.prototype.pickerType = function (value) {
        return this.addOption("pickerType", value);
    };

    var instantiate = function (selector, type, options) {
        var constructor = new Constructor(selector, type, options);

        return constructor;
    };

    return instantiate;
})();

//Helpers
function formatDate(date) {
    var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}
function tryParseInt(str, defaultValue) {
    var retValue = defaultValue;
    if (str) {
        if (str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseInt(str);
            }
        }
    }
    return retValue;
}
function formatDateTime(date) {
    var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        minute = d.getMinutes(),
        second = d.getSeconds();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hour.length < 2) hour = "0" + hour;
    if (minute.length < 2) minute = "0" + minute;
    if (second.length < 2) second = "0" + second;
    return [year, month, day].join("/") + "  " + [hour, minute, second].join(":");
}
function objectifyForm(formArray) {//serialize data function

    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]["name"]] = formArray[i]["value"];
    }
    return returnArray;
}