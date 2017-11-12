
$(document).ready(function () {
    $("#selectImage").imagepicker({
        hide_select: false
    });

    $("#selectImage").imagepicker( {
      limit_reached: function() {
        alert('You can only select 3 destinations.')
      }
    });

    $("#selectImage").imagepicker( {
      clicked: function(select, a, b) {
        $("*[multiple=multiple]").find("option:selected").each(function(index, item) {
          if (index != '') {
            console.log('enabled it')
            document.getElementById("sendMessageButton").disabled = false;
          } else {
            console.log('dsiable it')
            document.getElementById("sendMessageButton").disabled = true;
          }
        });
      }
    });


});



(function() {
  var ImagePicker, ImagePickerOption, both_array_are_equal, sanitized_options,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  jQuery.fn.extend({
    imagepicker: function(opts) {
      if (opts == null) {
        opts = {};
      }
      return this.each(function() {
        var select;
        select = jQuery(this);
        if (select.data("picker")) {
          select.data("picker").destroy();
        }
        select.data("picker", new ImagePicker(this, sanitized_options(opts)));
        if (opts.initialized != null) {
          return opts.initialized.call(select.data("picker"));
        }
      });
    }
  });

  sanitized_options = function(opts) {
    var default_options;
    default_options = {
      hide_select: true,
      show_label: false,
      initialized: void 0,
      changed: void 0,
      clicked: void 0,
      selected: void 0,
      limit: void 0,
      limit_reached: void 0,
      font_awesome: false
    };
    return jQuery.extend(default_options, opts);
  };

  both_array_are_equal = function(a, b) {
    var i, j, len, x;
    if ((!a || !b) || (a.length !== b.length)) {
      return false;
    }
    a = a.slice(0);
    b = b.slice(0);
    a.sort();
    b.sort();
    for (i = j = 0, len = a.length; j < len; i = ++j) {
      x = a[i];
      if (b[i] !== x) {
        return false;
      }
    }
    return true;
  };

  ImagePicker = (function() {
    function ImagePicker(select_element, opts1) {
      this.opts = opts1 != null ? opts1 : {};
      this.sync_picker_with_select = bind(this.sync_picker_with_select, this);
      this.select = jQuery(select_element);
      this.multiple = this.select.attr("multiple") === "multiple";
      if (this.select.data("limit") != null) {
        this.opts.limit = parseInt(this.select.data("limit"));
      }
      this.build_and_append_picker();
    }

    ImagePicker.prototype.destroy = function() {
      var j, len, option, ref;
      ref = this.picker_options;
      for (j = 0, len = ref.length; j < len; j++) {
        option = ref[j];
        option.destroy();
      }
      this.picker.remove();
      this.select.off("change", this.sync_picker_with_select);
      this.select.removeData("picker");
      return this.select.show();
    };

    ImagePicker.prototype.build_and_append_picker = function() {
      if (this.opts.hide_select) {
        this.select.hide();
      }
      this.select.on("change", this.sync_picker_with_select);
      if (this.picker != null) {
        this.picker.remove();
      }
      this.create_picker();
      this.select.after(this.picker);
      return this.sync_picker_with_select();
    };

    ImagePicker.prototype.sync_picker_with_select = function() {
      var j, len, option, ref, results;
      ref = this.picker_options;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        option = ref[j];
        if (option.is_selected()) {
          results.push(option.mark_as_selected());
        } else {
          results.push(option.unmark_as_selected());
        }
      }
      return results;
    };

    ImagePicker.prototype.create_picker = function() {
      this.picker = jQuery("<ul class='thumbnails image_picker_selector'></ul>");
      this.picker_options = [];
      this.recursively_parse_option_groups(this.select, this.picker);
      return this.picker;
    };

    ImagePicker.prototype.recursively_parse_option_groups = function(scoped_dom, target_container) {
      var container, j, k, len, len1, option, option_group, ref, ref1, results;
      ref = scoped_dom.children("optgroup");
      for (j = 0, len = ref.length; j < len; j++) {
        option_group = ref[j];
        option_group = jQuery(option_group);
        container = jQuery("<ul></ul>");
        container.append(jQuery("<li class='group_title'>" + (option_group.attr("label")) + "</li>"));
        target_container.append(jQuery("<li class='group'>").append(container));
        this.recursively_parse_option_groups(option_group, container);
      }
      ref1 = (function() {
        var l, len1, ref1, results1;
        ref1 = scoped_dom.children("option");
        results1 = [];
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          option = ref1[l];
          results1.push(new ImagePickerOption(option, this, this.opts));
        }
        return results1;
      }).call(this);
      results = [];
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        option = ref1[k];
        this.picker_options.push(option);
        if (!option.has_image()) {
          continue;
        }
        results.push(target_container.append(option.node));
      }
      return results;
    };

    ImagePicker.prototype.has_implicit_blanks = function() {
      var option;
      return ((function() {
        var j, len, ref, results;
        ref = this.picker_options;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          option = ref[j];
          if (option.is_blank() && !option.has_image()) {
            results.push(option);
          }
        }
        return results;
      }).call(this)).length > 0;
    };

    ImagePicker.prototype.selected_values = function() {
      if (this.multiple) {
        return this.select.val() || [];
      } else {
        return [this.select.val()];
      }
    };

    ImagePicker.prototype.toggle = function(imagepicker_option, original_event) {
      var new_values, old_values, selected_value;
      old_values = this.selected_values();
      selected_value = imagepicker_option.value().toString();
      if (this.multiple) {
        if (indexOf.call(this.selected_values(), selected_value) >= 0) {
          new_values = this.selected_values();
          new_values.splice(jQuery.inArray(selected_value, old_values), 1);
          this.select.val([]);
          this.select.val(new_values);
        } else {
          if ((this.opts.limit != null) && this.selected_values().length >= this.opts.limit) {
            if (this.opts.limit_reached != null) {
              this.opts.limit_reached.call(this.select);
            }
          } else {
            this.select.val(this.selected_values().concat(selected_value));
          }
        }
      } else {
        if (this.has_implicit_blanks() && imagepicker_option.is_selected()) {
          this.select.val("");
        } else {
          this.select.val(selected_value);
        }
      }
      if (!both_array_are_equal(old_values, this.selected_values())) {
        this.select.change();
        if (this.opts.changed != null) {
          return this.opts.changed.call(this.select, old_values, this.selected_values(), original_event);
        }
      }
    };

    return ImagePicker;

  })();

  ImagePickerOption = (function() {
    function ImagePickerOption(option_element, picker, opts1) {
      this.picker = picker;
      this.opts = opts1 != null ? opts1 : {};
      this.clicked = bind(this.clicked, this);
      this.option = jQuery(option_element);
      this.create_node();
    }

    ImagePickerOption.prototype.destroy = function() {
      return this.node.find(".thumbnail").off("click", this.clicked);
    };

    ImagePickerOption.prototype.has_image = function() {
      return this.option.data("img-src") != null;
    };

    ImagePickerOption.prototype.is_blank = function() {
      return !((this.value() != null) && this.value() !== "");
    };

    ImagePickerOption.prototype.is_selected = function() {
      var select_value;
      select_value = this.picker.select.val();
      if (this.picker.multiple) {
        return jQuery.inArray(this.value(), select_value) >= 0;
      } else {
        return this.value() === select_value;
      }
    };

    ImagePickerOption.prototype.mark_as_selected = function() {
      return this.node.find(".thumbnail").addClass("selected");
    };

    ImagePickerOption.prototype.unmark_as_selected = function() {
      return this.node.find(".thumbnail").removeClass("selected");
    };

    ImagePickerOption.prototype.value = function() {
      return this.option.val();
    };

    ImagePickerOption.prototype.label = function() {
      if (this.option.data("img-label")) {
        return this.option.data("img-label");
      } else {
        return this.option.text();
      }
    };

    ImagePickerOption.prototype.clicked = function(event) {
      this.picker.toggle(this, event);
      if (this.opts.clicked != null) {
        this.opts.clicked.call(this.picker.select, this, event);
      }
      if ((this.opts.selected != null) && this.is_selected()) {
        return this.opts.selected.call(this.picker.select, this, event);
      }
    };

    ImagePickerOption.prototype.create_node = function() {
      var image, imgAlt, imgClass, thumbnail;
      this.node = jQuery("<li/>");
      if (this.option.data("font_awesome")) {
        image = jQuery("<i>");
        image.attr("class", "fa-fw " + this.option.data("img-src"));
      } else {
        image = jQuery("<img class='image_picker_image'/>");
        image.attr("src", this.option.data("img-src"));
      }
      thumbnail = jQuery("<div class='thumbnail'>");
      imgClass = this.option.data("img-class");
      if (imgClass) {
        this.node.addClass(imgClass);
        image.addClass(imgClass);
        thumbnail.addClass(imgClass);
      }
      imgAlt = this.option.data("img-alt");
      if (imgAlt) {
        image.attr('alt', imgAlt);
      }
      thumbnail.on("click", this.clicked);
      thumbnail.append(image);
      if (this.opts.show_label) {
        thumbnail.append(jQuery("<p/>").html(this.label()));
      }
      this.node.append(thumbnail);
      return this.node;
    };

    return ImagePickerOption;

  })();

}).call(this);
