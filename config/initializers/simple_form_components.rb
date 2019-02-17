# frozen_string_literal: true
module SimpleForm
  module Components
    module Icons
      def icon(_wrapper_options = nil)
        return icon_class unless options[:icon].nil?
      end

      def icon_class
        template.content_tag(:i, "", class: "material-icons md-icon prefix") do
          options[:icon]
        end
      end
    end
		module RippleLine
			def ripple_line(wrapper_options = nil)
			  template.content_tag(:div, "", :class => "md-field-ripple-line")
			end
		end
  end
end

SimpleForm::Inputs::Base.send(:include, SimpleForm::Components::Icons)
SimpleForm::Inputs::Base.send(:include, SimpleForm::Components::RippleLine)
