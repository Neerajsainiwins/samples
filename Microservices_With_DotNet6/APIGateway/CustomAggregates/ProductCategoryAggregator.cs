using BrotliSharpLib;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Ocelot.Configuration;
using Ocelot.Middleware;
using Ocelot.Multiplexer;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace WebGateway.CustomAggregates
{
    public class ProductCls
    {
        public int ProductId { get; set; }

        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string Price { get; set; }
        public string Color { get; set; }
    }
    public class ProductCategoryAggregator : IDefinedAggregator
    {
        public async Task<DownstreamResponse> Aggregate(List<HttpContext> responses)
        {
            return null;
        }
    }
}
