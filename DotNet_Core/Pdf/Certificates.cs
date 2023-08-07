
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using RazorEngine;
using RazorEngine.Templating;
using IronPdf;
using System.IO;
using System.Drawing;
using ZXing.Rendering;
using ZXing;
using ZXing.QrCode.Internal;

namespace EService.Application.Services.PdfGeneration
{
    public class Certificates
    {
        private readonly IConfiguration _configuration;
        public Certificates(IConfiguration configuration)
        {
            _configuration = configuration;
            IronPdf.License.LicenseKey = configuration["IronPDF:Key"];
        }

        private static string GetMd5Hash(string input)
        {
            var md5 = MD5.Create();
            var inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
            var hash = md5.ComputeHash(inputBytes);
            var sb = new StringBuilder();
            foreach (byte t in hash)
            {
                sb.Append(t.ToString("X2"));
            }
            return sb.ToString();
        }
        public Byte[] CertificateConverter(string htmlContent, string cssContent, string applicationFieldData)
        {
            try
            {
                CertificateData certificateData = JsonConvert.DeserializeObject<CertificateData>(applicationFieldData);
                certificateData.QRCodeBaseURL = _configuration["Certificates:QRCodeURL"];
                certificateData.CustomImageUrl = _configuration["Certificates:ImageUrl"];

                string html = htmlContent;
                var template = @"<html><head><meta http-equiv=""Content-Type"" content=""text/html;charset=UTF-8""\><style>"
                    + cssContent + "</style></head><body>" + html + "</body></html>";

                string key = GetMd5Hash(template);
                string result;
                if (Engine.Razor.IsTemplateCached(key, null))
                    result = Engine.Razor.Run(key, null, certificateData);
                else
                    result = Engine.Razor.RunCompile(template, key, typeof(CertificateData), certificateData);

                var converter = new IronPdf.ChromePdfRenderer();
                converter.RenderingOptions.MarginLeft = 0;
                converter.RenderingOptions.MarginRight = 0;
                converter.RenderingOptions.MarginTop = 0;
                converter.RenderingOptions.MarginBottom = 0;
                converter.RenderingOptions.PaperSize = IronPdf.Rendering.PdfPaperSize.A4;
                converter.RenderingOptions.FitToPaperWidth = true;
                var doc = converter.RenderHtmlAsPdf(result);
                return doc.BinaryData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }

        public class CertificateData
        {
            string _QRCode;
            string _CustomImageUrl;
            public CertificateData()
            {
                _Fields = new List<FieldData>();
                _ProfileFields = new List<FieldData>();
                _RecordFields = new List<FieldData>();
                Fields = new FieldDataCollection(_Fields);
                ProfileFields = new FieldDataCollection(_ProfileFields);
                RecordFields = new FieldDataCollection(_RecordFields);
                TextAssets = new List<Asset>();
            }
            public string CertificateNumber { get; set; }
            public string QRCodeBaseURL { get; set; }
            public string CustomImageUrl { get; set; }
            public string URLId { get; set; }
            public string QRCode
            {
                get
                {
                    if (_QRCode != null)
                        return _QRCode;
                    //CODE TO GENERATE QR CODE;

                    var barcodeWrite = new ZXing.BarcodeWriter();

                    var encOptions = new ZXing.Common.EncodingOptions
                    {
                        Width = 250,
                        Height = 250,
                        Margin = 0,
                        PureBarcode = false
                    };
                    encOptions.Hints.Add(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);

                    barcodeWrite.Renderer = new BitmapRenderer();
                    barcodeWrite.Options = encOptions;
                    barcodeWrite.Format = ZXing.BarcodeFormat.QR_CODE;
                    Bitmap bitmapper = barcodeWrite.Write(QRCodeBaseURL + URLId);

                    Graphics graph = Graphics.FromImage(bitmapper);
                    var circleRectf = new RectangleF(80, 100, 95, 60);
                    graph.FillEllipse(Brushes.White, circleRectf);
                    var textRectf = new RectangleF(85, 115, 100, 50);
                    graph.DrawString("MOIAT", new Font("Tahoma", 18), Brushes.Black, textRectf);

                    using (var ms = new System.IO.MemoryStream())
                    {
                        bitmapper.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                        _QRCode = "data:image/png;base64," + Convert.ToBase64String(ms.ToArray());
                        return _QRCode;
                    }

                }
            }
            public DateTime? IssueDate { get; set; }
            public DateTime? ExpiryDate { get; set; }
            public int? IssueNumber { get; set; }
            public string RecordNumber { get; set; }
            public int? ProfileRecordId { get; set; }
            public DateTime? ProfileRecordCreatedDate { get; set; }
            public List<FieldData> _Fields { get; set; }
            public List<FieldData> _ProfileFields { get; set; }
            public List<FieldData> _RecordFields { get; set; }
            public List<Asset> TextAssets { get; set; }
            public FieldDataCollection Fields { get; set; }
            public FieldDataCollection ProfileFields { get; set; }
            public FieldDataCollection RecordFields { get; set; }

            public string this[string AssetName]
            {
                get
                {
                    _CustomImageUrl = TextAssets?.SingleOrDefault(t => t.Name == AssetName)?.Value;
                    _CustomImageUrl = _CustomImageUrl.Replace("{{CustomImages}}", CustomImageUrl);
                   return _CustomImageUrl;
                }
            }

        }
        public class FieldDataCollection
        {
            List<FieldData> Fields;
            public FieldDataCollection(List<FieldData> Fields)
            {
                this.Fields = Fields;
            }
            public FieldData this[int EntityFieldId]
            {
                get
                {
                    return Fields?.SingleOrDefault(f => f.EntityFieldId == EntityFieldId) ?? new FieldData();
                }
            }

            public FieldData this[string EntityFieldName]
            {
                get
                {
                    return Fields?.SingleOrDefault(f => f.EntityFieldName == EntityFieldName) ?? new FieldData();
                }
            }
        }

        public class FieldData
        {
            public FieldData()
            {
                ChildFields = new List<ChildFieldData>();
            }
            public const int ArabicLangId = 2, EnglishLangId = 1;
            public int EntityFieldId { get; set; }
            public string EntityFieldName { get; set; }
            public string Value { get; set; }
            public int? FieldValueCount { get; set; }
            public List<Text> Translations { get; set; }
            public string ArabicText { get { return Translations?.SingleOrDefault(t => t.LanguageId == ArabicLangId)?.Value; } }
            public string EnglishText { get { return Translations?.SingleOrDefault(t => t.LanguageId == EnglishLangId)?.Value; } }
            public List<ChildFieldData> ChildFields { get; set; }
        }
        public class ChildFieldData
        {
            public ChildFieldData()
            {
                Children = new List<ChildrenData>();
            }
            public int ItemIndex { get; set; }
            public List<ChildrenData> Children { get; set; }
        }
        public class ChildrenData
        {
            public int EntityFieldId { get; set; }
            public string EntityFieldName { get; set; }
            public string Value { get; set; }
            public List<Text> Translations { get; set; }
        }
        public class Asset
        {
            public string Name { get; set; }
            public string Value { get; set; }
        }

        public class Text
        {
            public int LanguageId { get; set; }
            public string Value { get; set; }
            public int LookupId { get; set; }
        }

        public string CertificatePreview(string htmlContent, string applicationFieldData)
        {
            try
            {
                CertificateData certificateData = JsonConvert.DeserializeObject<CertificateData>(applicationFieldData);

                string html = htmlContent;
                var template = html;

                string key = GetMd5Hash(template);
                string result;
                if (Engine.Razor.IsTemplateCached(key, null))
                    result = Engine.Razor.Run(key, null, certificateData);
                else
                    result = Engine.Razor.RunCompile(template, key, typeof(CertificateData), certificateData);

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}