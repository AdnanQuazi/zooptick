import * as Yup from "yup";

const deepGet = (obj, keys) => keys.reduce((xs, x) => xs?.[x] ?? null, obj);

const deepGetByPaths = (obj, ...paths) =>
  paths.map((path) =>
    deepGet(
      obj,
      path
        .replace(/\[([^\[\]]*)\]/g, ".$1.")
        .split(".")
        .filter((t) => t !== "")
    )
  );



export const createSchema = (config) => {
  return Yup.object().shape(generateSchema(config));
};

function generateSchema(config) {
  let generatedSchema = {};

  Object.keys(config).map((keyName) => {
    if (Array.isArray(config[keyName])) {
      config[keyName].map((field) => {
        if (field.name.includes(".")) {
            let nestedGenField = {};
            let validator = Yup.string();
            let schema ;
            let v;
            
            config[keyName].map((field , index)=> {
                schema = deepGetByPaths(field, "schema")[0]


                if (schema?.dataType?.condition === "string") {
                    validator = Yup.string().typeError(schema.dataType.error);
                  } else if (schema?.dataType?.condition === "number") {
                    validator = Yup.number().typeError(schema.dataType.error);
                  } else if (schema?.dataType?.condition === "mixed") {
                    validator = Yup.mixed();
                  } else if (schema?.dataType?.condition === "email") {
                    validator = validator.email();
                  }
                  if (schema.required.condition === true) {
                    validator = validator.required(schema.required.error);
                  }
                  if(schema.matches){
                    console.log(schema)
                    validator = validator.matches(new RegExp(schema.matches.with.slice(1,-1)),schema.matches.error)
                  }
                  if (schema.minLength) {
                    validator = validator.min(
                      parseInt(schema.minLength.condition),
                      schema.minLength.error
                    );
                  }
                  if (schema.maxLength) {
                    validator = validator.max(
                      schema.maxLength.condition,
                      schema.maxLength.error
                    );
                  }

                  const splitField = field.name.split(".")
                  nestedGenField[splitField[splitField.length - 1]] =  validator
            })
            const splitField = field.name.split(".")
            generatedSchema[splitField[0]] = Yup.object().shape(nestedGenField).default(undefined).required()


        } else {
          let validator = Yup.string();
          let schema = field.schema;

          if (schema?.dataType?.condition === "string") {
            validator = Yup.string();
          } else if (schema?.dataType?.condition === "number") {
            validator = Yup.number().typeError(schema.dataType.error);
          } else if (schema?.dataType?.condition === "mixed") {
            validator = Yup.mixed();
          } else if (schema?.dataType?.condition === "email") {
            validator = validator.email();
          }
          if(schema.matches){
            validator = validator.matches(schema.matches.with,schema.matches.error)
          }
          if (schema.required.condition === true) {
            validator = validator.required(schema.required.error);
          }
          if (schema.minLength) {
            validator = validator.min(
              parseInt(schema.minLength.condition),
              schema.minLength.error
            );
          }
          if (schema.maxLength) {
            validator = validator.max(
              schema.maxLength.condition,
              schema.maxLength.error
            );
          }

          generatedSchema[field.name] = validator;

        }
      });
    } else {
      generatedSchema = {
        ...generatedSchema,
        ...generateSchema(config[keyName]),
      };
    }
  });
  return generatedSchema;
}
