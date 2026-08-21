import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, useFormik } from "formik";
import { array, object } from "yup";

const VARIATIONS_CONFIG = {
  Clothing: {
    size: [
      {
        name: "targetGender",
        label: "Target Gender",
        type: "Select",
        options: ["Male", "Female", "Unisex"],
        required: true,
      },
      {
        name: "sizeAgeGroup",
        label: "Size Age Group",
        type: "Select",
        options: ["Adult", "Big Kid", "Little Kid", "Toddler", "Infant"],
        required: true,
      },
    ],
    common: [
      {
        name: "condition",
        label: "Condition",
        type: "Select",
        options: ["New", "Used"],
        required: true,
      },
      {
        name: "sellerSKU",
        label: "SKU",
        type: "text",
        required: true,
      },
      {
        name: "price",
        label: "Price",
        type: "number",
        required: true,
      },
      {
        name: "stock",
        label: "Stock",
        type: "number",
        required: true,
      },
    ],
  },
};
const CATEGORIES = [
  'Clothing',
  "Footwear"
]
const FORM_CONFIG = {
  Clothing: {
    fields: [
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
      },
      { name: "MRP", label: "MRP", type: "number", required: true },
      { name: "price", label: "Price", type: "number", required: true },
      {
        name: "hasVariation",
        label: "Does this product has Variation ?",
        type: "radio",
        options: ["Yes", "No"],
        rquired: true,
      },
      {
        name: "selectedVariations",
        label: "Size",
        value: "Size",
        type: "checkbox",
        required: false,
        dependsOn: { field: "hasVariation", value: "Yes" },
      },
      {
        name: "selectedVariations",
        label: "Color",
        value: "Color",
        type: "checkbox",
        required: false,
        dependsOn: { field: "hasVariation", value: "Yes" },
      },
      {
        name: "selectedVariations",
        label: "Material Type",
        value: "Material Type",
        type: "checkbox",
        required: false,
        dependsOn: { field: "hasVariation", value: "Yes" },
      },
      {
        name: "variationSizes",
        label: "Sizes",
        type: "Field-Array",
        requried: false,
        dependsOn: { field: "selectedVariations", value: "Size" },
      },
      {
        name: "variationColors",
        label: "Colors",
        type: "Field-Array",
        requried: false,
        dependsOn: { field: "selectedVariations", value: "Color" },
      },
      {
        name: "variationMaterialTypes",
        label: "Material Types",
        type: "Field-Array",
        requried: false,
        dependsOn: { field: "selectedVariations", value: "Material Type" },
        click: function (value, index, location, action) {
          if (action === "push") {
            location[this.name].push(value);
          }
          if (action === "remove") {
            location[this.name].splice(index, 1);
          }
        },
      },
    ],
  },
  Footwear: {
    fields: [
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
      },
      { name: "price", label: "Price", type: "number", required: true },
      {
        name: "hasVariations",
        label: "Does this product have variations?",
        type: "radio",
        options: ["Yes", "No"],
        required: true,
      },
    ],
    variationOptions: [
      { name: "size", label: "Size", type: "checkbox", required: false },
      { name: "color", label: "Color", type: "checkbox", required: false },
      {
        name: "materialType",
        label: "Material Type",
        type: "checkbox",
        required: false,
      },
    ],

    variationFields: {
      size: {
        name: "size",
        label: "Size",
        type: "select",
        options: ["6", "7", "8", "9", "10"],
        required: true,
      },
      color: {
        name: "color",
        label: "Color",
        type: "select",
        options: ["Red", "Blue", "Black"],
        required: true,
      },
      materialType: {
        name: "materialType",
        label: "Material Type",
        type: "select",
        options: ["Leather", "Synthetic"],
        required: true,
      },
      stock: { name: "stock", label: "Stock", type: "number", required: true },
    },
  },
  "General Store": {
    fields: [
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
      },
      { name: "price", label: "Price", type: "number", required: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
      },
    ],
  },
};

const DynamicForm = () => {
  const [category, setCategory] = useState("Clothing");
  const [form, setForm] = useState("");
  const [hasVariations, setHasVariations] = useState("");
  const [selectedVariations, setSelectedVariations] = useState([]);
  useEffect(() => {
    setForm(FORM_CONFIG[category]);
  }, [category]);

  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: form !== "" && generateInitialValues(form),
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    if (!form) return;
    setFieldValue("selectedVariations", []);
  }, [values.hasVariation]);

  return (
    <Formik
      initialValues={generateInitialValues(form)}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        console.log(values); // Log values to inspect structure
        // Handle form submission
      }}
    >
      <Form>
        {form && (
          <>
            {form.fields.map((field, index) => {
              return <div key={index}>{generateField(field, values)}</div>;
            })}
            <button type="submit">Submit</button>
          </>
        )}
      </Form>
    </Formik>
  );

  function generateField(field) {
    if (field.type === "text" || field.type === "number") {
      if (field.dependsOn) {
        return (
          <>
            {values[field.dependsOn.field] === field.dependsOn.value && (
              <>
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  type={field.type}
                  onChange={handleChange}
                  name={field.name}
                ></input>
              </>
            )}
          </>
        );
      }
      return (
        <>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            type={field.type}
            onChange={handleChange}
            name={field.name}
          ></input>
        </>
      );
    }

    if (field.type === "select") {
      return (
        <>
          <label htmlFor={field.name}>{field.label}</label>
          <select name={field.name}>
            <option value="">Select {field.label}</option>
            {field.options.map((option, index) => {
              return (
                <option key={index} value={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </>
      );
    }

    if (field.type === "radio") {
      return (
        <>
          {field.label}
          {field.options.map((option) => {
            return (
              <label htmlFor={field.name}>
                <input
                  type={field.type}
                  onChange={handleChange}
                  name={field.name}
                  value={option}
                ></input>
                {option}
              </label>
            );
          })}
        </>
      );
    }

    if (field.type === "checkbox") {
      if (field.dependsOn) {
        return (
          <>
            {values[field.dependsOn.field] === field.dependsOn.value && (
              <>
                <label htmlFor={field.name}>
                  <input
                    type={field.type}
                    onChange={handleChange}
                    name={field.name}
                    value={field.value}
                  ></input>
                  {field.value}
                </label>
              </>
            )}
          </>
        );
      } else {
      }
      return (
        <>
          <label htmlFor={field.name}>
            <input
              type={field.type}
              onChange={handleChange}
              name={field.name}
              value={field.value}
            ></input>
            {field.value}
          </label>
        </>
      );
    }

    if ((field.type = "Field-Array")) {
      if (field.dependsOn) {
        return (
          <>
            {values[field.dependsOn.field]?.includes(field.dependsOn.value) && (
              <>
              {values[field.name].map((elem,index) => (
                <Field name={`${field.name}[${index}]`} ></Field>
              ))}
              {console.log(values[field.name])}
              <button type="button" onClick={()=>{setFieldValue(field.name , values[field.name].concat(['']))}}>Add</button>
              </>
            )}
          </>
        );
      } else {
        return <h1>HAHh</h1>;
      }
    }
  }
  function generateInitialValues(config) {
    let initialValues = {};
    Object.keys(config).forEach((keyName) => {
      if (Array.isArray(config[keyName])) {
        config[keyName].forEach((field) => {
          if (field.type === "Field-Array") {
            initialValues[field.name] = [''];
          } else {
            initialValues[field.name] = field.type === "radio" ? false : "";
          }
        });
      } else {
        initialValues = {
          ...initialValues,
          ...generateInitialValues(config[keyName]),
        };
      }
    });
    return initialValues;
  }
};

// export default DynamicForm;
// const [category, setCategory] = useState("");
// const [formConfig, setFormConfig] = useState(null);
// const [showVariationOptions, setShowVariationOptions] = useState(false);

// useEffect(() => {
//   if (category) {
//     const config = FORM_CONFIG[category];
//     setFormConfig(config);
//   } else {
//     setFormConfig(null);
//   }
// }, [category]);

// const handleCategoryChange = (e) => {
//   setCategory(e.target.value);
//   setShowVariationOptions(false); // Reset the variation options state when category changes
// };

// const handleSubmit = (values) => {
//   console.log(values);
//   // Handle form submission logic
// };
// const { setFieldValue } = useFormik({
//   initialValues: formConfig && getInitialValues(formConfig.fields),
// });
// //   useEffect(()=>{
// //     if(formConfig){
// //         setFieldValue(variationOptions, {})
// //     }
// //   },[showVariationOptions])
// return (
//   <div>
//     <label htmlFor="category">Category</label>
//     <select id="category" name="category" onChange={handleCategoryChange}>
//       <option value="">Select a category</option>
//       {Object.keys(FORM_CONFIG).map((cat) => (
//         <option key={cat} value={cat}>
//           {cat}
//         </option>
//       ))}
//     </select>

//     {formConfig && (
//       <Formik
//         initialValues={getInitialValues(formConfig.fields)}
//         onSubmit={handleSubmit}
//       >
//         {({ values, setFieldValue }) => (
//           <Form>
//             {formConfig.fields.map((field, index) => (
//               <>
//                 {console.log(values)}
//                 <DynamicField
//                   key={index}
//                   field={field}
//                   values={values}
//                   setFieldValue={setFieldValue}
//                   setShowVariationOptions={setShowVariationOptions}
//                 />
//               </>
//             ))}
//             {showVariationOptions && values.hasVariations === "Yes" && (
//               <>
//                 <h3>Select Variation Options</h3>
//                 {formConfig.variationOptions.map((option, index) => (
//                   <>
//                     {console.log("ASdAsd", option)}
//                     <div key={index}>
//                       <label>
//                         <Field
//                           type="checkbox"
//                           name={`variationOptions.${option.name}`}
//                           value={option.name}
//                           checked={
//                             values.variationOptions?.[option.name] || false
//                           }
//                           onChange={(e) => {
//                             const checked = e.target.checked;
//                             if (checked) {
//                               setFieldValue(
//                                 `variationOptions.${option.name}`,
//                                 true
//                               );
//                             } else {
//                               setFieldValue(
//                                 `variationOptions.${option.name}`,
//                                 false
//                               );
//                             }
//                           }}
//                         />
//                         {option.label}
//                       </label>
//                     </div>
//                   </>
//                 ))}
//                 {values.variationOptions &&
//                   Object.values(values.variationOptions).some(
//                     (value) => value
//                   ) && (
//                     <FieldArray name="variations">
//                       {({ push, remove, form }) => (
//                         <div>
//                           <h3>Variations</h3>
//                           {form.values.variations.map((_, index) => (
//                             <div key={index}>
//                               {Object.keys(values.variationOptions).map(
//                                 (option) =>
//                                   values.variationOptions[option] && (
//                                     <div key={option}>
//                                       <DynamicInputField
//                                         name={`variations.${index}.${formConfig.variationFields[option].name}`}
//                                         field={
//                                           formConfig.variationFields[option]
//                                         }
//                                       />
//                                     </div>
//                                   )
//                               )}
//                               <DynamicInputField
//                                 name={`variations.${index}.stock`}
//                                 field={formConfig.variationFields.stock}
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => remove(index)}
//                               >
//                                 Remove
//                               </button>
//                             </div>
//                           ))}
//                           <button type="button" onClick={() => push({})}>
//                             Add Variation
//                           </button>
//                         </div>
//                       )}
//                     </FieldArray>
//                   )}
//               </>
//             )}
//             <button type="submit">Submit</button>
//           </Form>
//         )}
//       </Formik>
//     )}
//   </div>
// );
// };

// const getInitialValues = (fields) => {
// const initialValues = {};
// fields.forEach((field) => {
//   if (field.type === "group") {
//     initialValues[field.name] = [{}];
//   } else if (field.type === "checkboxGroup") {
//     initialValues[field.name] = [];
//   } else if (field.name === "hasVariations") {
//     initialValues[field.name] = "No";
//   } else {
//     initialValues[field.name] = "";
//   }
// });
// initialValues.variationOptions = {};
// initialValues.variations = [];
// return initialValues;
// };

// const DynamicField = ({
// field,
// values,
// setFieldValue,
// setShowVariationOptions,
// }) => {
// const handleHasVariationsChange = (event) => {
//   setFieldValue(field.name, event.target.value);
//   setShowVariationOptions(event.target.value === "Yes");
// };

// return (
//   <div>
//     <label htmlFor={field.name}>{field.label}</label>
//     {field.type === "textarea" ? (
//       <Field as="textarea" name={field.name} required={field.required} />
//     ) : field.type === "select" ? (
//       <Field as="select" name={field.name} required={field.required}>
//         <option value="">Select an option</option>
//         {field.options.map((option, index) => (
//           <option key={index} value={option}>
//             {option}
//           </option>
//         ))}
//       </Field>
//     ) : field.type === "radio" ? (
//       field.options.map((option) => (
//         <div key={option}>
//           <label>
//             <Field
//               type="radio"
//               name={field.name}
//               value={option}
//               checked={values[field.name] === option}
//               onChange={
//                 field.name === "hasVariations"
//                   ? handleHasVariationsChange
//                   : undefined
//               }
//             />
//             {option}
//           </label>
//         </div>
//       ))
//     ) : field.type === "checkboxGroup" ? (
//       field.options.map((option) => (
//         <div key={option}>
//           <label>
//             <Field type="checkbox" name={field.name} value={option} />
//             {option}
//           </label>
//         </div>
//       ))
//     ) : (
//       <Field name={field.name} type={field.type} required={field.required} />
//     )}
//   </div>
// );
// };

// const DynamicInputField = ({ name, field }) => {
// return (
//   <div>
//     <label htmlFor={name}>{field.label}</label>
//     {field.type === "textarea" ? (
//       <Field as="textarea" name={name} required={field.required} />
//     ) : field.type === "select" ? (
//       <Field as="select" name={name} required={field.required}>
//         <option value="">Select an option</option>
//         {field.options.map((option, index) => (
//           <option key={index} value={option}>
//             {option}
//           </option>
//         ))}
//       </Field>
//     ) : (
//       <Field name={name} type={field.type} required={field.required} />
//     )}
//   </div>
// );
