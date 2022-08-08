using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Common.AutoMapper
{
    public sealed class DTOMapper<T, D> where T : class where D : class
    {
        private readonly D instance = Activator.CreateInstance<D>();

        public D Serialize(T input)
        {
            foreach (PropertyInfo prop in input.GetType().GetProperties())
            {
                var value = typeof(T).GetProperty(prop.Name).GetValue(input);
                var propType = typeof(T).GetProperty(prop.Name);
                if (propType.ToString().Contains("System.Collections"))
                {
                    var serializeList = JsonConvert.SerializeObject(value);
                    typeof(D).GetProperty(prop.Name).SetValue(instance, serializeList);
                }
                else
                {
                    typeof(D).GetProperty(prop.Name).SetValue(instance, value);

                }
            }
            return instance;
        }
        public D Deserialize(T input)
        {
            foreach (PropertyInfo prop in input.GetType().GetProperties())
            {
                var value = typeof(T).GetProperty(prop.Name).GetValue(input);
                var propType = typeof(D).GetProperty(prop.Name);
                if (propType.ToString().Contains("System.Collections"))
                {
                    var result = JsonConvert.DeserializeObject(value.ToString(), typeof(D).GetProperty(prop.Name).PropertyType);
                    typeof(D).GetProperty(prop.Name).SetValue(instance, result);
                }
                else
                {
                    typeof(D).GetProperty(prop.Name).SetValue(instance, value);
                }
            }
            return instance;
        }
    }
}
