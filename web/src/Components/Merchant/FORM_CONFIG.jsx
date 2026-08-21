const FORM_CONFIG = {
  Clothing: {
    "Product Information": [
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
        schema: {
          required: { value: true, message: "Product name is required" },
          minLength: {
            value: 2,
            message: "Should be at least of 2 characters",
          },
          maxLength: {
            value: 70,
            message: "Maximum 70 characters are allowed",
          },
        },
      },
      {
        name: "subCategory",
        label: "Sub Category",
        type: "text",
        required: true,
        schema: {
          required: { value: true, message: "Sub Category is required" },
          minLength: {
            value: 2,
            message: "Should be at least of 2 characters",
          },
          maxLength: {
            value: 70,
            message: "Maximum 70 characters are allowed",
          },
        },
      },
      {
        name: "brand",
        label: "Brand",
        type: "text",
        required: true,
        schema: {
          required: { value: true, message: "Brand name is required" },
          minLength: {
            value: 2,
            message: "Should be at least of 2 characters",
          },
          maxLength: {
            value: 70,
            message: "Maximum 70 characters are allowed",
          },
        },
      },
      {
        name: "desc",
        label: "Description",
        type: "textarea",
        required: true,
        schema: {
          required: { value: true, message: "Description is required" },
          minLength: {
            value: 2,
            message: "Should be at least of 2 characters",
          },
          maxLength: {
            value: 500,
            message: "Maximum 500 characters are allowed",
          },
        },
      },
      // {
      //   name: "MRP",
      //   label: "MRP",
      //   type: "number",
      //   required: true,
      //   schema: {
      //     required: { value: true, message: "MRP is requried" },
      //     min: { value: 1, message: "Minimum amount is Rs 1.00" },
      //     max: { value: 100000, message: "Maximum amount is Rs 100000.00" },
      //     valueAsNumber: true,
      //   },
      // },
      // {
      //   name: "sellingPrice",
      //   label: "Selling Price",
      //   type: "number",
      //   required: true,
      //   schema: {
      //     required: { value: true, message: "Selling price is requried" },
      //     min: { value: 1, message: "Minimum amount is Rs 1.00" },
      //     max: { value: 100000, message: "Maximum amount is Rs 100000.00" },
      //     valueAsNumber: true,
      //   },
      // },
    ],
    "Variation Details": [
      {
        name: "hasVariation",
        label: "Does this product have variations?",
        type: "radio",
        options: ["Yes", "No"],
        rquired: true,
        schema: {
          required: { value: true, message: "Please choose an option" },
        },
      },
      {
        name: "selectedVariations",
        label: "",
        type: "checkbox",
        options: ["Size", "Color", "MaterialType"],
        required: false,
        dependsOn: { field: "hasVariation", value: "Yes" },
        schema : {
          deps : ["hasVariation"]
        },
        validation: (getValues) => {
          return (value) => {
            const shouldValidate = getValues("hasVariation");
            if (shouldValidate === "Yes" && value.length < 1) {
              return "At least select one variation";
            }
            return true;
          };
        }
      },
      {
        name: "variationSize",
        label: "",
        placeholder: "Size",
        subType: "Text-Array",
        type: "text",
        requried: false,
        dependsOn: { field: "selectedVariations", value: "Size" },
      },
      {
        name: "variationColor",
        label: "",
        placeholder: "Color",
        subType: "Text-Array",
        type: "text",
        requried: false,
        dependsOn: { field: "selectedVariations", value: "Color" },
      },
      {
        name: "variationMaterialType",
        label: "",
        placeholder: "Material Type",
        subType: "Text-Array",
        type: "text",
        requried: false,
        dependsOn: { field: "selectedVariations", value: "MaterialType" },
      },
    ],
    Variations: {
      Size: [
        {
          name: "Target Gender",
          label: "Target Gender",
          placeholder: "Target Gender",
          type: "select",
          options: ["Male", "Female", "Unisex"],
          required: true,
          schema: {
            required: { value: true, message: "Please choose an option" },
          },
        },
        {
          name: "Size Age Group",
          label: "Size Age Group",
          placeholder: "Size Age Group",
          type: "select",
          options: ["Adult", "Big Kid", "Little Kid", "Toddler", "Infant"],
          required: true,
          schema: {
            required: { value: true, message: "Please choose an option" },
          },
        },
      ],
      Color: [
        {
          name: "Color Map",
          label: "Color Map",
          placeholder: "Color Map",
          type: "select",
          options: ["Red", "Blue", "Green"],
          required: true,
          schema: {
            required: { value: true, message: "Please choose an option" },
          },
        },
      ],
      Common: [
        {
          name: "Condition",
          placeholder: "Condition",
          label: "Condition",
          type: "select",
          options: ["New", "Used"],
          required: true,
          schema: {
            required: { value: true, message: "Please choose an option" },
          },
        },
        {
          name: "SKU",
          placeholder: "SKU",
          label: "SKU",
          type: "text",
          required: true,
          schema: {
            required: { value: true, message: "SKU is requried" },
          },
          validation: (getValues,checkSkuExists) => {
            return {
                notDuplicate: (value) => {
                  const skus = getValues("variants").map(
                    (product) => product.SKU
                  );
                  return (
                    skus.filter((sku) => sku === value).length === 1 ||
                    "SKU must be unique"
                  );
                },
                asyncValid: async (value) => {
                 const {exists} = await checkSkuExists(value)
                 console.log(exists)
                 if(exists) return "SKU is already used for another product"
                },
            };
          },
        },
        {
          name: "MRP",
          label: "MRP",
          placeholder: "MRP",
          type: "number",
          step: "any",
          required: true,
          schema: {
            required: { value: true, message: "MRP is requried" },
            min: { value: 1, message: "Minimum amount is Rs 1.00" },
            max: { value: 100000, message: "Maximum amount is Rs 100000.00" },
            valueAsNumber: true,
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: " Maximum two decimal places allowed.",
            },
          },
        },
        {
          name: "sellingPrice",
          label: "Selling Price",
          placeholder: "Selling Price",
          type: "number",
          step: "any",
          required: true,
          schema: {
            required: { value: true, message: "Selling price is requried" },
            min: { value: 1, message: "Minimum amount is Rs 1.00" },
            max: { value: 100000, message: "Maximum amount is Rs 100000.00" },
            valueAsNumber: true,
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: " Maximum two decimal places allowed.",
            },
          },
        },
        {
          name: "Stock",
          placeholder: "Stock",
          label: "Stock",
          type: "number",
          required: true,
          schema: {
            required: { value: true, message: "Stock is requried" },
            valueAsNumber: true,
          },
        },
        {
          name: "Images",
          placeholder: "Product Image",
          label: "Product Image",
          type: "file",
          accept: "image/*",
          rquired: true,
        },
      ],
    },
    "Tax Details": [
      {
        name: "hsn",
        label: "HSN",
        type: "text",
        requried: true,
        schema: {
          required: { value: true, message: "HSN code is required" },
        },
      },
      {
        name: "GST rate slab",
        label: "GST rate slab %",
        type: "select",
        options: [0, 3, 5, 12, 18, 28],
        requried: true,
        schema: {
          required: { value: true, message: "Please choose an option" },
        },
      },
    ],
  },
  Footwear: {
    "Product Information": [
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
        schema: {
          required: { value: true, message: "Product name is required" },
          minLength: {
            value: 2,
            message: "Should be at least of 2 characters",
          },
          maxLength: {
            value: 70,
            message: "Maximum 70 characters are allowed",
          },
        },
      },
      {
        name: "subCategory",
        label: "Sub Category",
        type: "text",
        required: true,
        schema: {
          required: { value: true, message: "Sub Category is required" },
          minLength: {
            value: 2,
            message: "Should be at least of 2 characters",
          },
          maxLength: {
            value: 70,
            message: "Maximum 70 characters are allowed",
          },
        },
      },
      {
        name: "brand",
        label: "Brand",
        type: "text",
        required: true,
        schema: {
          required: { value: true, message: "Brand name is required" },
          minLength: {
            value: 2,
            message: "Should be at least of 2 characters",
          },
          maxLength: {
            value: 70,
            message: "Maximum 70 characters are allowed",
          },
        },
      },
      {
        name: "desc",
        label: "Description",
        type: "textarea",
        required: true,
        schema: {
          required: { value: true, message: "Description is required" },
          minLength: {
            value: 2,
            message: "Should be at least of 2 characters",
          },
          maxLength: {
            value: 500,
            message: "Maximum 500 characters are allowed",
          },
        },
      },
      // {
      //   name: "MRP",
      //   label: "MRP",
      //   type: "number",
      //   required: true,
      //   schema: {
      //     required: { value: true, message: "MRP is requried" },
      //     min: { value: 1, message: "Minimum amount is Rs 1.00" },
      //     max: { value: 100000, message: "Maximum amount is Rs 100000.00" },
      //     valueAsNumber: true,
      //   },
      // },
      // {
      //   name: "sellingPrice",
      //   label: "Selling Price",
      //   type: "number",
      //   required: true,
      //   schema: {
      //     required: { value: true, message: "Selling price is requried" },
      //     min: { value: 1, message: "Minimum amount is Rs 1.00" },
      //     max: { value: 100000, message: "Maximum amount is Rs 100000.00" },
      //     valueAsNumber: true,
      //   },
      // },
    ],
    "Variation Details": [
      {
        name: "hasVariation",
        label: "Does this product have variations?",
        type: "radio",
        options: ["Yes", "No"],
        rquired: true,
        schema: {
          required: { value: true, message: "Please choose an option" },
        },
      },
      {
        name: "selectedVariations",
        label: "",
        type: "checkbox",
        options: ["Size", "Color", "MaterialType"],
        required: false,
        dependsOn: { field: "hasVariation", value: "Yes" },
        schema : {
          deps : ["hasVariation"]
        },
        validation: (getValues) => {
          return (value) => {
            const shouldValidate = getValues("hasVariation");
            if (shouldValidate === "Yes" && value.length < 1) {
              return "At least select one variation";
            }
            return true;
          };
        }
      },
      {
        name: "variationSize",
        label: "",
        placeholder: "Size",
        subType: "Text-Array",
        type: "text",
        requried: false,
        dependsOn: { field: "selectedVariations", value: "Size" },
      },
      {
        name: "variationColor",
        label: "",
        placeholder: "Color",
        subType: "Text-Array",
        type: "text",
        requried: false,
        dependsOn: { field: "selectedVariations", value: "Color" },
      },
      {
        name: "variationMaterialType",
        label: "",
        placeholder: "Material Type",
        subType: "Text-Array",
        type: "text",
        requried: false,
        dependsOn: { field: "selectedVariations", value: "MaterialType" },
      },
    ],
    Variations: {
      Size: [
        {
          name: "Target Gender",
          label: "Target Gender",
          placeholder: "Target Gender",
          type: "select",
          options: ["Male", "Female", "Unisex"],
          required: true,
          schema: {
            required: { value: true, message: "Please choose an option" },
          },
        },
        {
          name: "Size Age Group",
          label: "Size Age Group",
          placeholder: "Size Age Group",
          type: "select",
          options: ["Adult", "Big Kid", "Little Kid", "Toddler", "Infant"],
          required: true,
          schema: {
            required: { value: true, message: "Please choose an option" },
          },
        },
        {
          name: "Size Metric",
          label: "Size Metric",
          placeholder: "Size Metric",
          type: "select",
          options: ["UK/IND", "US"],
          required: true,
          schema: {
            required: { value: true, message: "Please choose an option" },
          },
        },
      ],
      Color: [
        {
          name: "Color Map",
          label: "Color Map",
          placeholder: "Color Map",
          type: "select",
          options: ["Red", "Blue", "Green"],
          required: true,
          schema: {
            required: { value: true, message: "Please choose an option" },
          },
        },
      ],
      Common: [
        {
          name: "Condition",
          placeholder: "Condition",
          label: "Condition",
          type: "select",
          options: ["New", "Used"],
          required: true,
          schema: {
            required: { value: true, message: "Please choose an option" },
          },
        },
        {
          name: "SKU",
          placeholder: "SKU",
          label: "SKU",
          type: "text",
          required: true,
          schema: {
            required: { value: true, message: "SKU is requried" },
          },
          validation: (getValues,checkSkuExists) => {
            return {
                notDuplicate: (value) => {
                  const skus = getValues("variants").map(
                    (product) => product.SKU
                  );
                  return (
                    skus.filter((sku) => sku === value).length === 1 ||
                    "SKU must be unique"
                  );
                },
                asyncValid: async (value) => {
                 const {exists} = await checkSkuExists(value)
                 console.log(exists)
                 if(exists) return "SKU is already used for another product"
                },
            };
          },
        },
        {
          name: "MRP",
          label: "MRP",
          placeholder: "MRP",
          type: "number",
          step: "any",
          required: true,
          schema: {
            required: { value: true, message: "MRP is requried" },
            min: { value: 1, message: "Minimum amount is Rs 1.00" },
            max: { value: 100000, message: "Maximum amount is Rs 100000.00" },
            valueAsNumber: true,
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: " Maximum two decimal places allowed.",
            },
          },
        },
        {
          name: "sellingPrice",
          label: "Selling Price",
          placeholder: "Selling Price",
          type: "number",
          step: "any",
          required: true,
          schema: {
            required: { value: true, message: "Selling price is requried" },
            min: { value: 1, message: "Minimum amount is Rs 1.00" },
            max: { value: 100000, message: "Maximum amount is Rs 100000.00" },
            valueAsNumber: true,
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: " Maximum two decimal places allowed.",
            },
          },
        },
        {
          name: "Stock",
          placeholder: "Stock",
          label: "Stock",
          type: "number",
          required: true,
          schema: {
            required: { value: true, message: "Stock is requried" },
            valueAsNumber: true,
          },
        },
        {
          name: "Images",
          placeholder: "Product Image",
          label: "Product Image",
          type: "file",
          accept: "image/*",
          rquired: true,
        },
      ],
    },
    "Tax Details": [
      {
        name: "hsn",
        label: "HSN",
        type: "text",
        requried: true,
        schema: {
          required: { value: true, message: "HSN code is required" },
        },
      },
      {
        name: "GST rate slab",
        label: "GST rate slab %",
        type: "select",
        options: [0, 3, 5, 12, 18, 28],
        requried: true,
        schema: {
          required: { value: true, message: "Please choose an option" },
        },
      },
    ],
  },
  Bangles: {
    "Product Information": [
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
        schema: {
          required: { value: true, message: "Product name is required" },
          minLength: {
            value: 2,
            message: "Should be at least of 2 characters",
          },
          maxLength: {
            value: 70,
            message: "Maximum 70 characters are allowed",
          },
        },
      },
      {
        name: "subCategory",
        label: "Sub Category",
        type: "text",
        required: true,
        schema: {
          required: { value: true, message: "Sub Category is required" },
          minLength: {
            value: 2,
            message: "Should be at least of 2 characters",
          },
          maxLength: {
            value: 70,
            message: "Maximum 70 characters are allowed",
          },
        },
      },
      {
        name: "brand",
        label: "Brand",
        type: "text",
        required: true,
        schema: {
          required: { value: true, message: "Brand name is required" },
          minLength: {
            value: 2,
            message: "Should be at least of 2 characters",
          },
          maxLength: {
            value: 70,
            message: "Maximum 70 characters are allowed",
          },
        },
      },
      {
        name: "desc",
        label: "Description",
        type: "textarea",
        required: true,
        schema: {
          required: { value: true, message: "Description is required" },
          minLength: {
            value: 2,
            message: "Should be at least of 2 characters",
          },
          maxLength: {
            value: 500,
            message: "Maximum 500 characters are allowed",
          },
        },
      },
      // {
      //   name: "MRP",
      //   label: "MRP",
      //   type: "number",
      //   required: true,
      //   schema: {
      //     required: { value: true, message: "MRP is requried" },
      //     min: { value: 1, message: "Minimum amount is Rs 1.00" },
      //     max: { value: 100000, message: "Maximum amount is Rs 100000.00" },
      //     valueAsNumber: true,
      //   },
      // },
      // {
      //   name: "sellingPrice",
      //   label: "Selling Price",
      //   type: "number",
      //   required: true,
      //   schema: {
      //     required: { value: true, message: "Selling price is requried" },
      //     min: { value: 1, message: "Minimum amount is Rs 1.00" },
      //     max: { value: 100000, message: "Maximum amount is Rs 100000.00" },
      //     valueAsNumber: true,
      //   },
      // },
    ],
    "Variation Details": [
      {
        name: "hasVariation",
        label: "Does this product have variations?",
        type: "radio",
        options: ["Yes", "No"],
        rquired: true,
        schema: {
          required: { value: true, message: "Please choose an option" },
        },
      },
      {
        name: "selectedVariations",
        label: "",
        type: "checkbox",
        options: ["Size", "Color", "MaterialType"],
        required: false,
        dependsOn: { field: "hasVariation", value: "Yes" },
        schema : {
          deps : ["hasVariation"]
        },
        validation: (getValues) => {
          return (value) => {
            const shouldValidate = getValues("hasVariation");
            if (shouldValidate === "Yes" && value.length < 1) {
              return "At least select one variation";
            }
            return true;
          };
        }
      },
      {
        name: "variationSize",
        label: "",
        placeholder: "Size",
        subType: "Text-Array",
        type: "text",
        requried: false,
        dependsOn: { field: "selectedVariations", value: "Size" },
      },
      {
        name: "variationColor",
        label: "",
        placeholder: "Color",
        subType: "Text-Array",
        type: "text",
        requried: false,
        dependsOn: { field: "selectedVariations", value: "Color" },
      },
      {
        name: "variationMaterialType",
        label: "",
        placeholder: "Material Type",
        subType: "Text-Array",
        type: "text",
        requried: false,
        dependsOn: { field: "selectedVariations", value: "MaterialType" },
      },
    ],
    Variations: {
      Size: [
        {
          name: "Target Gender",
          label: "Target Gender",
          placeholder: "Target Gender",
          type: "select",
          options: ["Male", "Female", "Unisex"],
          required: true,
          schema: {
            required: { value: true, message: "Please choose an option" },
          },
        },
        {
          name: "Size Age Group",
          label: "Size Age Group",
          placeholder: "Size Age Group",
          type: "select",
          options: ["Adult", "Big Kid", "Little Kid", "Toddler", "Infant"],
          required: true,
          schema: {
            required: { value: true, message: "Please choose an option" },
          },
        },
      ],
      Color: [
        {
          name: "Color Map",
          label: "Color Map",
          placeholder: "Color Map",
          type: "select",
          options: ["Red", "Blue", "Green"],
          required: true,
          schema: {
            required: { value: true, message: "Please choose an option" },
          },
        },
      ],
      Common: [
        {
          name: "occasion",
          label: "Occasion",
          placeholder: "Occasion",
          type: "select",
          options: [
            "All Day",
            "Casual",
            "Bridal",
            "Ethnic / PartyWear",
            "ALl Purpose",
          ],
          requried: true,
          schema: {
            required: { value: true, message: "Please choose an option" },
          },
        },
        {
          name: "Condition",
          placeholder: "Condition",
          label: "Condition",
          type: "select",
          options: ["New", "Used"],
          required: true,
          schema: {
            required: { value: true, message: "Please choose an option" },
          },
        },
        {
          name: "SKU",
          placeholder: "SKU",
          label: "SKU",
          type: "text",
          required: true,
          schema: {
            required: { value: true, message: "SKU is requried" },
          },
          validation: (getValues,checkSkuExists) => {
            return {
                notDuplicate: (value) => {
                  const skus = getValues("variants").map(
                    (product) => product.SKU
                  );
                  return (
                    skus.filter((sku) => sku === value).length === 1 ||
                    "SKU must be unique"
                  );
                },
                asyncValid: async (value) => {
                 const {exists} = await checkSkuExists(value)
                 console.log(exists)
                 if(exists) return "SKU is already used for another product"
                },
            };
          },
        },
        {
          name: "MRP",
          label: "MRP",
          placeholder: "MRP",
          type: "number",
          step: "any",
          required: true,
          schema: {
            required: { value: true, message: "MRP is requried" },
            min: { value: 1, message: "Minimum amount is Rs 1.00" },
            max: { value: 100000, message: "Maximum amount is Rs 100000.00" },
            valueAsNumber: true,
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: " Maximum two decimal places allowed.",
            },
          },
        },
        {
          name: "sellingPrice",
          label: "Selling Price",
          placeholder: "Selling Price",
          type: "number",
          step: "any",
          required: true,
          schema: {
            required: { value: true, message: "Selling price is requried" },
            min: { value: 1, message: "Minimum amount is Rs 1.00" },
            max: { value: 100000, message: "Maximum amount is Rs 100000.00" },
            valueAsNumber: true,
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: " Maximum two decimal places allowed.",
            },
          },
        },
        {
          name: "Stock",
          placeholder: "Stock",
          label: "Stock",
          type: "number",
          required: true,
          schema: {
            required: { value: true, message: "Stock is requried" },
            valueAsNumber: true,
          },
        },
        {
          name: "Images",
          placeholder: "Product Image",
          label: "Product Image",
          type: "file",
          accept: "image/*",
          rquired: true,
        },
      ],
    },
    "Tax Details": [
      {
        name: "hsn",
        label: "HSN",
        type: "text",
        requried: true,
        schema: {
          required: { value: true, message: "HSN code is required" },
        },
      },
      {
        name: "GST rate slab",
        label: "GST rate slab %",
        type: "select",
        options: [0, 3, 5, 12, 18, 28],
        requried: true,
        schema: {
          required: { value: true, message: "Please choose an option" },
        },
      },
    ],
  },
};
export default FORM_CONFIG;
