  private DataTable CCOComprehensiveAssessmentPDFTemplate(string lifeplanFile, DataSet dataSetFillPDF, FillableCCOComprehensiveAssessmentPDFRequest fillablePDFRequest, string tabName)
        {
            string compAssessmentId = dataSetFillPDF.Tables[0].Rows[0]["CompAssessmentId"].ToString();
            string clientId = dataSetFillPDF.Tables[0].Rows[0]["ClientId"].ToString();

            string commonFileName = compAssessmentId + "_" + clientId + "_" + DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".pdf";
            string pdfPath = ConfigurationManager.AppSettings["TempPDF"].ToString() + "ComprehensiveAssessment_" + commonFileName;
            File.Copy(lifeplanFile, pdfPath, true);

            string ComprehensiveAssessmentPDF = ConfigurationManager.AppSettings["FillablePDF"].ToString() + "Completed_CCO_ComprehensiveAssessmentPDF.pdf";
            string newFile = ConfigurationManager.AppSettings["TempPDF"].ToString() + "Completed_CCO_ComprehensiveAssessmentPDF_" + commonFileName;
            File.Copy(ComprehensiveAssessmentPDF, newFile, true);

            string circleOfSupportPDF = ConfigurationManager.AppSettings["FillablePDF"].ToString() + "Circle_Of_Support.pdf";
            string circleOfSupport = ConfigurationManager.AppSettings["TempPDF"].ToString() + "Circle_Of_Support_" + commonFileName;
            File.Copy(circleOfSupportPDF, circleOfSupport, true);

            string medicalHealthPDF = ConfigurationManager.AppSettings["FillablePDF"].ToString() + "Medical_Health.pdf";
            string medicalHealth = ConfigurationManager.AppSettings["TempPDF"].ToString() + "Medical_Health_" + commonFileName;
            File.Copy(medicalHealthPDF, medicalHealth, true);

            string medicationsPDF = ConfigurationManager.AppSettings["FillablePDF"].ToString() + "Medications.pdf";
            string medications = ConfigurationManager.AppSettings["TempPDF"].ToString() + "Medications_" + commonFileName;
            File.Copy(medicationsPDF, medications, true);

            string guardianshipPDF = ConfigurationManager.AppSettings["FillablePDF"].ToString() + "Guradianship.pdf";
            string guardianship = ConfigurationManager.AppSettings["TempPDF"].ToString() + "Guradianship_" + commonFileName;
            File.Copy(guardianshipPDF, guardianship, true);

            //string finalDocPDF = ConfigurationManager.AppSettings["FillablePDF"].ToString() + "FinalCCO_ComprehensiveAssessmentPDF.pdf";
            //string finalDoc = ConfigurationManager.AppSettings["TempPDF"].ToString() + "FinalCCO_ComprehensiveAssessmentPDF_" + commonFileName;
            //File.Copy(finalDocPDF, finalDoc, true);

            string final1DocPDF = ConfigurationManager.AppSettings["FillablePDF"].ToString() + "Final1CCO_ComprehensiveAssessmentPDF.pdf";
            string final1Doc = ConfigurationManager.AppSettings["TempPDF"].ToString() + "Final1CCO_ComprehensiveAssessmentPDF_" + commonFileName;
            File.Copy(final1DocPDF, final1Doc, true);

            string final2DocPDF = ConfigurationManager.AppSettings["FillablePDF"].ToString() + "Final2CCO_ComprehensiveAssessmentPDF.pdf";
            string final2Doc = ConfigurationManager.AppSettings["TempPDF"].ToString() + "Final2CCO_ComprehensiveAssessmentPDF_" + commonFileName;
            File.Copy(final2DocPDF, final2Doc, true);

            string fina3DocPDF = ConfigurationManager.AppSettings["FillablePDF"].ToString() + "Final3CCO_ComprehensiveAssessmentPDF.pdf";
            string fina3Doc = ConfigurationManager.AppSettings["TempPDF"].ToString() + "Final3CCO_ComprehensiveAssessmentPDF_" + commonFileName;
            File.Copy(fina3DocPDF, fina3Doc, true);

            string fina4DocPDF = ConfigurationManager.AppSettings["FillablePDF"].ToString() + "Final4CCO_ComprehensiveAssessmentPDF.pdf";
            string fina4Doc = ConfigurationManager.AppSettings["TempPDF"].ToString() + "Final4CCO_ComprehensiveAssessmentPDF_" + commonFileName;
            File.Copy(fina4DocPDF, fina4Doc, true);

            string fina5DocPDF = ConfigurationManager.AppSettings["FillablePDF"].ToString() + "Final5CCO_ComprehensiveAssessmentPDF.pdf";
            string fina5Doc = ConfigurationManager.AppSettings["TempPDF"].ToString() + "Final5CCO_ComprehensiveAssessmentPDF_" + commonFileName;
            File.Copy(fina5DocPDF, fina5Doc, true);

            iTextSharp.text.pdf.PdfReader pdfReader = new iTextSharp.text.pdf.PdfReader(pdfPath);

            DataTable dataTable = new DataTable();
            PdfStamper pdfStamper = new PdfStamper(pdfReader, new FileStream(newFile, FileMode.Create));
            try
            {

                DataTable CCOComprehensiveAssessment = dataSetFillPDF.Tables[0];
                DataTable EligibilityInformation = dataSetFillPDF.Tables[1];
                DataTable Communication = dataSetFillPDF.Tables[2];
                DataTable MemberProviders = dataSetFillPDF.Tables[3];
                DataTable CircleOfSupport = dataSetFillPDF.Tables[4];
                DataTable GuardianshipAndAdvocacy = dataSetFillPDF.Tables[5];
                DataTable AdvancedDirectivesFuturePlanning = dataSetFillPDF.Tables[6];
                DataTable IndependentLivingSkills = dataSetFillPDF.Tables[7];
                DataTable SocialServiceNeeds = dataSetFillPDF.Tables[8];
                DataTable MedicalHealth = dataSetFillPDF.Tables[17];
                DataTable HealthPromotion = dataSetFillPDF.Tables[9];
                DataTable BehavioralHealth = dataSetFillPDF.Tables[10];
                DataTable ChallengingBehaviors = dataSetFillPDF.Tables[11];
                DataTable BehavioralSupportPlan = dataSetFillPDF.Tables[12];
                DataTable Community = dataSetFillPDF.Tables[13];
                DataTable Education = dataSetFillPDF.Tables[14];
                DataTable TransitonPlanning = dataSetFillPDF.Tables[15];
                DataTable Employment = dataSetFillPDF.Tables[16];
                DataTable Medicationss = dataSetFillPDF.Tables[19];
                DataTable MedicalHealthDiagnosis = dataSetFillPDF.Tables[20];
                DataTable MedicalHealthAllergies = dataSetFillPDF.Tables[21];
                DataTable MedicalHealthExpired = dataSetFillPDF.Tables[22];
                DataTable GuardianshipAndAdvocacyGrid = dataSetFillPDF.Tables[23];

                PdfPTable Medications = new PdfPTable(5);
                PdfPTable tableMedicationss = new PdfPTable(2);
                PdfPTable CircleOfSupportTable = new PdfPTable(11);
                PdfPTable tableCircleOfSupport = new PdfPTable(2);
                PdfPTable MedicalHelathTable = new PdfPTable(5);
                PdfPTable MedicalHelathAllergiesTable = new PdfPTable(5);
                PdfPTable MedicalHelathExpTable = new PdfPTable(5);
                PdfPTable tableMedicalHelath = new PdfPTable(2);
                PdfPTable GuardianshipTable = new PdfPTable(6);
                PdfPTable Guardianship = new PdfPTable(2);

                Medications.WidthPercentage = 100f;
                tableMedicationss.WidthPercentage = 80f;
                CircleOfSupportTable.WidthPercentage = 100f;
                tableCircleOfSupport.WidthPercentage = 80f;
                MedicalHelathTable.WidthPercentage = 100f;
                MedicalHelathAllergiesTable.WidthPercentage = 100f;
                MedicalHelathExpTable.WidthPercentage = 100f;
                GuardianshipTable.WidthPercentage = 100f;
                tableMedicalHelath.WidthPercentage = 80f;
                Guardianship.WidthPercentage = 80f;

                CircleOfSupportTable.SplitLate = false;
                tableCircleOfSupport.SplitLate = false;



                AcroFields pdfFormFields = pdfStamper.AcroFields;
                pdfFormFields.GenerateAppearances = true;


                fillCCOComprehensiveAssessmentSection(pdfFormFields, CCOComprehensiveAssessment);
                fillEligibiltyInformationSection(pdfFormFields, EligibilityInformation);
                fillCommunication_LanguageSection(pdfFormFields, Communication);
                fillMemberProviderSection(pdfFormFields, MemberProviders);
                fillGuardianshipAndAdvocacySection(pdfFormFields, GuardianshipAndAdvocacy);
                fillAdvancedDirectivesFuturePlanningSection(pdfFormFields, AdvancedDirectivesFuturePlanning);
                fillIndependentLivingSkillsSection(pdfFormFields, IndependentLivingSkills);
                fillSocialServiceNeedsSection(pdfFormFields, SocialServiceNeeds);
                fillMedicalHealthSection(pdfFormFields, MedicalHealth);
                fillHealthPromotionSection(pdfFormFields, HealthPromotion);
                fillBehavioralHealthSection(pdfFormFields, BehavioralHealth);
                fillChallengingBehaviorsSection(pdfFormFields, ChallengingBehaviors);
                fillBehavioralSupportPlanSection(pdfFormFields, BehavioralSupportPlan);
                fillCommumunitySocialParticipationSection(pdfFormFields, Community);
                fillEducationSection(pdfFormFields, Education);
                fillTransitionPlanningSection(pdfFormFields, TransitonPlanning);
                fillEmploymentSection(pdfFormFields, Employment);

                if (_beforeSixDecemberWithPublisedVersion == "True")
                {
                    var bf = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, false);
                    var bfl = BaseFont.CreateFont(BaseFont.HELVETICA_BOLD, BaseFont.CP1252, false);

                    var addTextUnknown = new TextField(pdfStamper.Writer, new Rectangle(_lastRadioOption.Left - 70, _lastRadioOption.Top, _lastRadioOption.Right + 40, _lastRadioOption.Bottom - 10), "lastRadioOptionUnknown")
                    {
                        Alignment = Element.ALIGN_CENTER & Element.ALIGN_LEFT,
                        BackgroundColor = BaseColor.WHITE,
                        Font = bf,
                        FontSize = 9,
                        MaxCharacterLength = 100,
                        Options = TextField.MULTILINE | TextField.READ_ONLY,
                        Text = "Unknown"
                    };
                    var addRadioNo = new TextField(pdfStamper.Writer, new Rectangle(_lastRadioOption.Left - 126, _lastRadioOption.Top, _lastRadioOption.Right - 100, _lastRadioOption.Bottom - 10), "lastRadioOptionNo")
                    {
                        Alignment = Element.ALIGN_CENTER & Element.ALIGN_LEFT,
                        BackgroundColor = BaseColor.WHITE,
                        Font = bf,
                        FontSize = 9,
                        MaxCharacterLength = 100,
                        Options = TextField.MULTILINE | TextField.READ_ONLY,
                        Text = "No"
                    };
                    var addRadioYes = new TextField(pdfStamper.Writer, new Rectangle(_lastRadioOption.Left - 176, _lastRadioOption.Top, _lastRadioOption.Right - 155, _lastRadioOption.Bottom - 10), "lastRadioOptionYes")
                    {
                        Alignment = Element.ALIGN_CENTER & Element.ALIGN_LEFT,
                        BackgroundColor = BaseColor.WHITE,
                        Font = bf,
                        FontSize = 9,
                        //BorderColor = BaseColor.BLACK,
                        MaxCharacterLength = 100,
                        //BorderStyle = PdfBorderDictionary.STYLE_SOLID,
                        Options = TextField.MULTILINE | TextField.READ_ONLY,
                        Text = "Yes"
                    };
                    var addTextLabel = new TextField(pdfStamper.Writer, new Rectangle(_lastRadioOption.Left - 205, _lastRadioOption.Top + 45, _lastRadioOption.Right + 60, _lastRadioOption.Bottom + 15), "lastRadioOptionUnknown")
                    {
                        Alignment = Element.ALIGN_CENTER & Element.ALIGN_LEFT,
                        BackgroundColor = BaseColor.WHITE,
                        Font = bfl,
                        FontSize = 9,
                        MaxCharacterLength = 100,
                        Options = TextField.MULTILINE | TextField.READ_ONLY,
                        Text = "Does the member currently have any involvement in the criminal justice system? (Incarceration, probation, victim's rights, advocacy, etc.)"
                    };
                    pdfStamper.AddAnnotation(addTextLabel.GetTextField(), _lastRadioOption.PageNumber);
                    pdfStamper.AddAnnotation(addTextUnknown.GetTextField(), _lastRadioOption.PageNumber);
                    pdfStamper.AddAnnotation(addRadioNo.GetTextField(), _lastRadioOption.PageNumber);
                    pdfStamper.AddAnnotation(addRadioYes.GetTextField(), _lastRadioOption.PageNumber);
                }
                pdfStamper.FormFlattening = true;

                pdfStamper.Dispose();
                pdfStamper.Close();
                pdfReader.Dispose();
                pdfReader.Close();


                iTextSharp.text.Font fntTableFontHdr = FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.BOLD, BaseColor.BLACK);
                iTextSharp.text.Font fntTableFont = FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
                iTextSharp.text.Font pageTextFont = FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.ITALIC, BaseColor.BLACK);
                PdfPCell cell = new PdfPCell(new Phrase("Medications"));
                cell.Colspan = 5;
                cell.BackgroundColor = new BaseColor(208, 249, 249);
                cell.HorizontalAlignment = 1;
                Medications.SpacingBefore = 30f;
                Medications.AddCell(cell);

                if (fillablePDFRequest.medications.Count > 0)
                {
                    for (var i = 0; i < fillablePDFRequest.medications.Count(); i++)
                    {
                        Medications.AddCell(new PdfPCell(new Phrase("Medication Name")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        Medications.AddCell(new PdfPCell(new Phrase("Start Date")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        Medications.AddCell(new PdfPCell(new Phrase("Stop Date")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        Medications.AddCell(new PdfPCell(new Phrase("Prescribed By")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        Medications.AddCell(new PdfPCell(new Phrase("Pharmacy Name")) { BackgroundColor = new BaseColor(208, 249, 249) });



                        Medications.AddCell(new Phrase(fillablePDFRequest.medications[i].MedicationName == null ? "" : fillablePDFRequest.medications[i].MedicationName.ToString(), fntTableFont));
                        Medications.AddCell(new Phrase(fillablePDFRequest.medications[i].StartDate == null ? "" : fillablePDFRequest.medications[i].StartDate.ToString(), fntTableFont));
                        Medications.AddCell(new Phrase(fillablePDFRequest.medications[i].StopDate == null ? "" : fillablePDFRequest.medications[i].StopDate.ToString(), fntTableFont));
                        Medications.AddCell(new Phrase(fillablePDFRequest.medications[i].PrescribedBy == null ? "" : fillablePDFRequest.medications[i].PrescribedBy.ToString(), fntTableFont));
                        Medications.AddCell(new Phrase(fillablePDFRequest.medications[i].PharmacyName == null ? "" : fillablePDFRequest.medications[i].PharmacyName.ToString(), fntTableFont));


                        var filtered = new List<JSONMedicationsChildData>();
                        DataTable dataTable1 = new DataTable();

                        var rows = Medicationss.AsEnumerable().Where
                           (row => row.Field<int>("MedicationListId").ToString() == fillablePDFRequest.medications[i].MedicationListID);

                        if (rows.Any())
                        {
                            dataTable1 = rows.CopyToDataTable<DataRow>();
                        }


                        if (dataTable1.Rows.Count > 0)
                        {
                            DataRow rowMedicationss = dataTable1.Rows[0];
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("PRN Medication?")) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase(rowMedicationss["PRNMedicationName"].ToString(), fntTableFont)) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("Medication Monitoring Plan?")) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase(rowMedicationss["MedicationMonitoringPlanName"].ToString(), fntTableFont)) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("Is the medication monitored by a psychiatrist?")) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase(rowMedicationss["MonitoredPsychiatristName"].ToString(), fntTableFont)) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("Pain Management Medication?")) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase(rowMedicationss["PainManagementMedicationName"].ToString(), fntTableFont)) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("Does the member and/or family understand the use of each medication?")) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase(rowMedicationss["MemUnderstandMedicationName"].ToString(), fntTableFont)) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("Does the member and/or family feel that the medication is effective at treating its intended condition/illness?")) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase(rowMedicationss["MemFeelMedicationEffectiveName"].ToString(), fntTableFont)) { PaddingBottom = 10 });


                        }
                        else
                        {
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("PRN Medication?")) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("", fntTableFont)) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("Medication Monitoring Plan?")) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("", fntTableFont)) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("Is the medication monitored by a psychiatrist?")) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("", fntTableFont)) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("Pain Management Medication?")) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("", fntTableFont)) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("Does the member and/or family understand the use of each medication?")) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("", fntTableFont)) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("Does the member and/or family feel that the medication is effective at treating its intended condition/illness?")) { PaddingBottom = 10 });
                            tableMedicationss.AddCell(new PdfPCell(new Phrase("", fntTableFont)) { PaddingBottom = 10 });

                        }
                        Medications.AddCell(new PdfPCell(tableMedicationss) { Colspan = 5, HorizontalAlignment = 1, PaddingBottom = 10, PaddingLeft = 10, PaddingRight = 10, PaddingTop = 10 });
                        Medications.AddCell(new PdfPCell(new Phrase(" ")) { Colspan = 5, HorizontalAlignment = 1, Border = Rectangle.TOP_BORDER });

                        tableMedicationss.DeleteBodyRows();

                        dataTable1.Clear();
                    }
                }
                else
                {
                    Medications.AddCell(new PdfPCell(new Phrase("Medication Name")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    Medications.AddCell(new PdfPCell(new Phrase("Start Date")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    Medications.AddCell(new PdfPCell(new Phrase("Stop Date")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    Medications.AddCell(new PdfPCell(new Phrase("Prescribed By")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    Medications.AddCell(new PdfPCell(new Phrase("Pharmacy Name")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    Medications.AddCell(new PdfPCell(new Phrase("No Records")) { Colspan = 5, HorizontalAlignment = 1, PaddingBottom = 10 });
                }

                PdfPCell cell1 = new PdfPCell(new Phrase("Circle Of Support"));
                cell1.Colspan = 11;
                cell1.BackgroundColor = new BaseColor(208, 249, 249);
                cell1.HorizontalAlignment = 1;
                PdfPCell cell22 = new PdfPCell(new Phrase("Select each 'Professional' contact to answer additional questions."));
                cell22.Colspan = 11;
                cell22.BackgroundColor = new BaseColor(208, 249, 249);
                cell22.HorizontalAlignment = 1;
                CircleOfSupportTable.SpacingBefore = 30f;
                CircleOfSupportTable.AddCell(cell1);
                CircleOfSupportTable.AddCell(cell22);

                if (fillablePDFRequest.circleOfSupports != null)
                {
                    if (fillablePDFRequest.circleOfSupports.Count > 0)
                    {
                        for (int i = 0; i < fillablePDFRequest.circleOfSupports.Count(); i++)
                        {
                            CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Circle of Support Contact")) { BackgroundColor = new BaseColor(208, 249, 249) });
                            CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact City")) { BackgroundColor = new BaseColor(208, 249, 249) });
                            CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact State")) { BackgroundColor = new BaseColor(208, 249, 249) });
                            CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Relationship to the Member")) { BackgroundColor = new BaseColor(208, 249, 249) });
                            CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact Phone Number")) { BackgroundColor = new BaseColor(208, 249, 249) });
                            CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact Address Line 1")) { BackgroundColor = new BaseColor(208, 249, 249) });
                            CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact Address Line 2")) { BackgroundColor = new BaseColor(208, 249, 249) });
                            CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact ZIP Code")) { BackgroundColor = new BaseColor(208, 249, 249) });
                            CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Type of Contact")) { BackgroundColor = new BaseColor(208, 249, 249) });
                            CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Member Provider Services")) { BackgroundColor = new BaseColor(208, 249, 249) });
                            CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Member Satisfaction")) { BackgroundColor = new BaseColor(208, 249, 249) });

                            CircleOfSupportTable.AddCell(new Phrase(fillablePDFRequest.circleOfSupports[i].CircleofSupportContact != null ? fillablePDFRequest.circleOfSupports[i].CircleofSupportContact.ToString() : "", fntTableFont));
                            CircleOfSupportTable.AddCell(new Phrase(fillablePDFRequest.circleOfSupports[i].ContactCity != null ? fillablePDFRequest.circleOfSupports[i].ContactCity.ToString() : "", fntTableFont));
                            CircleOfSupportTable.AddCell(new Phrase(fillablePDFRequest.circleOfSupports[i].ContactState != null ? fillablePDFRequest.circleOfSupports[i].ContactState.ToString() : "", fntTableFont));
                            CircleOfSupportTable.AddCell(new Phrase(fillablePDFRequest.circleOfSupports[i].Relationship != null ? fillablePDFRequest.circleOfSupports[i].Relationship.ToString() : "", fntTableFont));
                            CircleOfSupportTable.AddCell(new Phrase(fillablePDFRequest.circleOfSupports[i].ContactPhoneNumber != null ? fillablePDFRequest.circleOfSupports[i].ContactPhoneNumber.ToString() : "", fntTableFont));
                            CircleOfSupportTable.AddCell(new Phrase(fillablePDFRequest.circleOfSupports[i].ContactAddressLine1 != null ? fillablePDFRequest.circleOfSupports[i].ContactAddressLine1.ToString() : "", fntTableFont));
                            CircleOfSupportTable.AddCell(new Phrase(fillablePDFRequest.circleOfSupports[i].ContactAddressLine2 != null ? fillablePDFRequest.circleOfSupports[i].ContactAddressLine2.ToString() : "", fntTableFont));
                            CircleOfSupportTable.AddCell(new Phrase(fillablePDFRequest.circleOfSupports[i].ContactZIPCode != null ? fillablePDFRequest.circleOfSupports[i].ContactZIPCode.ToString() : "", fntTableFont));
                            CircleOfSupportTable.AddCell(new Phrase(fillablePDFRequest.circleOfSupports[i].TypeofContact != null ? fillablePDFRequest.circleOfSupports[i].TypeofContact.ToString() : "", fntTableFont));
                            CircleOfSupportTable.AddCell(new Phrase(fillablePDFRequest.circleOfSupports[i].ProviderServices != null ? fillablePDFRequest.circleOfSupports[i].ProviderServices.ToString() : "", fntTableFont));
                            CircleOfSupportTable.AddCell(new Phrase(fillablePDFRequest.circleOfSupports[i].Relationship != null ? fillablePDFRequest.circleOfSupports[i].Relationship.ToString() : "", fntTableFont));
                            string dataContactType = "";
                            if (fillablePDFRequest.circleOfSupports[i].CircleofSupportContact != null)
                            {
                                dataContactType = fillablePDFRequest.circleOfSupports[i].CircleofSupportContact.ToString();
                            }

                            if (dataContactType == "Professional")
                            {


                                var filtered1 = new List<JSONCircleOfSupportData>();
                                DataTable dataTable2 = new DataTable();

                                var rows1 = CircleOfSupport.AsEnumerable().Where
                                   (row => row.Field<int>("ContactID") == fillablePDFRequest.circleOfSupports[i].CircleOfSupportId);

                                if (rows1.Any())
                                {
                                    dataTable2 = rows1.CopyToDataTable<DataRow>();
                                }

                                if (dataTable2.Rows.Count > 0)
                                {
                                    DataRow rowMedicationss = dataTable2.Rows[0];
                                    tableCircleOfSupport.AddCell(new PdfPCell(new Phrase("How often does the individual utilize this Provider or their services ? ")) { PaddingBottom = 10 });
                                    tableCircleOfSupport.AddCell(new PdfPCell(new Phrase(rowMedicationss["IndividualUtilizeProvider"].ToString(), fntTableFont)) { PaddingBottom = 10 });
                                    tableCircleOfSupport.AddCell(new PdfPCell(new Phrase("Is the member satisfied with the Provider?")) { PaddingBottom = 10 });
                                    tableCircleOfSupport.AddCell(new PdfPCell(new Phrase(rowMedicationss["SatisfiedWithProvider"].ToString(), fntTableFont)) { PaddingBottom = 10 });
                                    tableCircleOfSupport.AddCell(new PdfPCell(new Phrase("If the member is dissatisfied with the Provider, do they want to change to a new Provider?")) { PaddingBottom = 10 });
                                    tableCircleOfSupport.AddCell(new PdfPCell(new Phrase(rowMedicationss["ChangeToNewProvider"].ToString(), fntTableFont)) { PaddingBottom = 10 });

                                }
                                else
                                {
                                    tableCircleOfSupport.AddCell(new PdfPCell(new Phrase("How often does the individual utilize this Provider or their services ? ")) { PaddingBottom = 10 });
                                    tableCircleOfSupport.AddCell(new PdfPCell(new Phrase("", fntTableFont)) { PaddingBottom = 10 });
                                    tableCircleOfSupport.AddCell(new PdfPCell(new Phrase("Is the member satisfied with the Provider?")) { PaddingBottom = 10 });
                                    tableCircleOfSupport.AddCell(new PdfPCell(new Phrase("", fntTableFont)) { PaddingBottom = 10 });
                                    tableCircleOfSupport.AddCell(new PdfPCell(new Phrase("If the member is dissatisfied with the Provider, do they want to change to a new Provider?")) { PaddingBottom = 10 });
                                    tableCircleOfSupport.AddCell(new PdfPCell(new Phrase("", fntTableFont)) { PaddingBottom = 10 });

                                }

                                CircleOfSupportTable.AddCell(new PdfPCell(tableCircleOfSupport) { Colspan = 11, HorizontalAlignment = 1, PaddingBottom = 10, PaddingLeft = 10, PaddingRight = 10, PaddingTop = 10 });
                                CircleOfSupportTable.AddCell(new PdfPCell(new Phrase(" ")) { Colspan = 11, HorizontalAlignment = 1, Border = Rectangle.TOP_BORDER });

                                tableCircleOfSupport.DeleteBodyRows();

                                dataTable2.Clear();
                            }
                        }
                    }
                    else
                    {
                        CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Circle of Support Contact")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact City")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact State")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Relationship to the Member")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact Phone Number")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact Address Line 1")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact Address Line 2")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact ZIP Code")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Type of Contact")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Member Provider Services")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Member Satisfaction")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("No Records")) { Colspan = 11, HorizontalAlignment = 1, PaddingBottom = 10 });
                    }
                }
                else
                {
                    CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Circle of Support Contact")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact City")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact State")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Relationship to the Member")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact Phone Number")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact Address Line 1")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact Address Line 2")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Contact ZIP Code")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Type of Contact")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Member Provider Services")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("Member Satisfaction")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    CircleOfSupportTable.AddCell(new PdfPCell(new Phrase("No Records")) { Colspan = 11, HorizontalAlignment = 1, PaddingBottom = 10 });
                }


                PdfPCell cell2 = new PdfPCell(new Phrase("Active Diagnosis"));
                cell2.Colspan = 5;
                cell2.BackgroundColor = new BaseColor(208, 249, 249);
                cell2.HorizontalAlignment = 1;
                MedicalHelathTable.SpacingBefore = 30f;
                MedicalHelathTable.AddCell(cell2);


                if (fillablePDFRequest.activeDiagnoses != null)
                {
                    for (int i = 0; i < fillablePDFRequest.activeDiagnoses.Count(); i++)
                    {
                        MedicalHelathTable.AddCell(new PdfPCell(new Phrase("Diagnosis Date")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        MedicalHelathTable.AddCell(new PdfPCell(new Phrase("Code")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        MedicalHelathTable.AddCell(new PdfPCell(new Phrase("Description")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        MedicalHelathTable.AddCell(new PdfPCell(new Phrase("Type")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        MedicalHelathTable.AddCell(new PdfPCell(new Phrase("Expiration Date")) { BackgroundColor = new BaseColor(208, 249, 249) });

                        if (fillablePDFRequest.activeDiagnoses[i].DiagnosisDate != null)
                        {
                            MedicalHelathTable.AddCell(new Phrase(fillablePDFRequest.activeDiagnoses[i].DiagnosisDate.ToString(), fntTableFont));
                        }
                        else
                        {
                            MedicalHelathTable.AddCell(new Phrase(" ", fntTableFont));
                        }
                        if (fillablePDFRequest.activeDiagnoses[i].DiagnosisCode != null)
                        {
                            MedicalHelathTable.AddCell(new Phrase(fillablePDFRequest.activeDiagnoses[i].DiagnosisCode.ToString(), fntTableFont));
                        }
                        else
                        {
                            MedicalHelathTable.AddCell(new Phrase(" ", fntTableFont));
                        }
                        if (fillablePDFRequest.activeDiagnoses[i].DiagnosisDescription != null)
                        {
                            MedicalHelathTable.AddCell(new Phrase(fillablePDFRequest.activeDiagnoses[i].DiagnosisDescription.ToString(), fntTableFont));
                        }
                        else
                        {
                            MedicalHelathTable.AddCell(new Phrase(" ", fntTableFont));
                        }
                        if (fillablePDFRequest.activeDiagnoses[i].DiagnosisType != null)
                        {
                            MedicalHelathTable.AddCell(new Phrase(fillablePDFRequest.activeDiagnoses[i].DiagnosisType.ToString(), fntTableFont));
                        }
                        else
                        {
                            MedicalHelathTable.AddCell(new Phrase(" ", fntTableFont));
                        }

                        if (fillablePDFRequest.activeDiagnoses[i].ExpirationDate != null)
                        {
                            MedicalHelathTable.AddCell(new Phrase(fillablePDFRequest.activeDiagnoses[i].ExpirationDate.ToString(), fntTableFont));
                        }
                        else
                        {
                            MedicalHelathTable.AddCell(new Phrase(" ", fntTableFont));
                        }


                        var filtered2 = new List<JSONActiveDiagnosisData>();
                        DataTable dataTable3 = new DataTable();

                        var rows2 = MedicalHealthDiagnosis.AsEnumerable().Where
                           (row => row.Field<int>("DiagnosisId") == fillablePDFRequest.activeDiagnoses[i].DiagnosisID);

                        if (rows2.Any())
                        {
                            dataTable3 = rows2.CopyToDataTable<DataRow>();
                        }

                        if (dataTable3.Rows.Count > 0)
                        {
                            DataRow rowMedicationss = dataTable3.Rows[0];
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase(" Have any of the member's symptoms gotten worse since onset of condition? ")) { PaddingBottom = 10 });
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase(rowMedicationss["MemSymptomsGottenWorseName"].ToString(), fntTableFont)) { PaddingBottom = 10 });
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase("Has the member experienced any new symptoms since onset of diagnosis?")) { PaddingBottom = 10 });
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase(rowMedicationss["MemNewSymptomsName"].ToString(), fntTableFont)) { PaddingBottom = 10 });
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase(" Is the member experiencing financial, transportation, or other barriers to being able to follow their physician's recommendations for this condition?")) { PaddingBottom = 10 });
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase(rowMedicationss["MemFinacTranspOtherBarriersName"].ToString(), fntTableFont)) { PaddingBottom = 10 });
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase(" Does this condition interfere with the member's ability to perform activities of daily living, including leisure skills or activities?")) { PaddingBottom = 10 });
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase(rowMedicationss["IndvAbilityToDailyLivingName"].ToString(), fntTableFont)) { PaddingBottom = 10 });
                        }
                        else
                        {
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase("Have any of the member's symptoms gotten worse since onset of condition? ")) { PaddingBottom = 10 });
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase("", fntTableFont)) { PaddingBottom = 10 });
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase("Has the member experienced any new symptoms since onset of diagnosis?")) { PaddingBottom = 10 });
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase("", fntTableFont)) { PaddingBottom = 10 });
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase("Is the member experiencing financial, transportation, or other barriers to being able to follow their physician's recommendations for this condition?")) { PaddingBottom = 10 });
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase("", fntTableFont)) { PaddingBottom = 10 });
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase("Does this condition interfere with the member's ability to perform activities of daily living, including leisure skills or activities?")) { PaddingBottom = 10 });
                            tableMedicalHelath.AddCell(new PdfPCell(new Phrase("", fntTableFont)) { PaddingBottom = 10 });
                        }

                        MedicalHelathTable.AddCell(new PdfPCell(tableMedicalHelath) { Colspan = 5, HorizontalAlignment = 1, PaddingBottom = 10, PaddingLeft = 10, PaddingRight = 10, PaddingTop = 10 });
                        MedicalHelathTable.AddCell(new PdfPCell(new Phrase(" ")) { Colspan = 5, HorizontalAlignment = 1, Border = Rectangle.TOP_BORDER });

                        tableMedicalHelath.DeleteBodyRows();

                        dataTable3.Clear();
                    }
                }
                else
                {
                    MedicalHelathTable.AddCell(new PdfPCell(new Phrase("Diagnosis Date")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    MedicalHelathTable.AddCell(new PdfPCell(new Phrase("Code")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    MedicalHelathTable.AddCell(new PdfPCell(new Phrase("Description")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    MedicalHelathTable.AddCell(new PdfPCell(new Phrase("Type")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    MedicalHelathTable.AddCell(new PdfPCell(new Phrase("Expiration Date")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    MedicalHelathTable.AddCell(new PdfPCell(new Phrase("No Records")) { Colspan = 5, HorizontalAlignment = 1, PaddingBottom = 10 });
                }

                PdfPCell cell23 = new PdfPCell(new Phrase("Allergies"));
                cell23.Colspan = 5;
                cell23.BackgroundColor = new BaseColor(208, 249, 249);
                cell23.HorizontalAlignment = 1;
                MedicalHelathAllergiesTable.SpacingBefore = 30f;
                MedicalHelathAllergiesTable.AddCell(cell23);


                if (MedicalHealthAllergies.Rows.Count > 0)
                {
                    for (int i = 0; i < MedicalHealthAllergies.Rows.Count; i++)
                    {

                        DataRow _allergies = MedicalHealthAllergies.Rows[i];
                        MedicalHelathAllergiesTable.AddCell(new PdfPCell(new Phrase("Diagnosis Date")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        MedicalHelathAllergiesTable.AddCell(new PdfPCell(new Phrase("Code")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        MedicalHelathAllergiesTable.AddCell(new PdfPCell(new Phrase("Description")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        MedicalHelathAllergiesTable.AddCell(new PdfPCell(new Phrase("Type")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        MedicalHelathAllergiesTable.AddCell(new PdfPCell(new Phrase("Allergy Name")) { BackgroundColor = new BaseColor(208, 249, 249) });

                        if (_allergies["DiagnosisDate"] != null)
                        {
                            MedicalHelathAllergiesTable.AddCell(new Phrase(_allergies["DiagnosisDate"].ToString(), fntTableFont));
                        }
                        else
                        {
                            MedicalHelathAllergiesTable.AddCell(new Phrase(" ", fntTableFont));
                        }
                        if (_allergies["Code"] != null)
                        {
                            MedicalHelathAllergiesTable.AddCell(new Phrase(_allergies["Code"].ToString(), fntTableFont));
                        }
                        else
                        {
                            MedicalHelathAllergiesTable.AddCell(new Phrase(" ", fntTableFont));
                        }
                        if (_allergies["Description"] != null)
                        {
                            MedicalHelathAllergiesTable.AddCell(new Phrase(_allergies["Description"].ToString(), fntTableFont));
                        }
                        else
                        {
                            MedicalHelathAllergiesTable.AddCell(new Phrase(" ", fntTableFont));
                        }
                        if (_allergies["Type"] != null)
                        {
                            MedicalHelathAllergiesTable.AddCell(new Phrase(_allergies["Type"].ToString(), fntTableFont));
                        }
                        else
                        {
                            MedicalHelathAllergiesTable.AddCell(new Phrase(" ", fntTableFont));
                        }
                        if (_allergies["AllergyName"] != null)
                        {
                            MedicalHelathAllergiesTable.AddCell(new Phrase(_allergies["AllergyName"].ToString(), fntTableFont));
                        }
                        else
                        {
                            MedicalHelathAllergiesTable.AddCell(new Phrase(" ", fntTableFont));
                        }

                        MedicalHelathAllergiesTable.AddCell(new PdfPCell(tableMedicalHelath) { Colspan = 6, HorizontalAlignment = 1, PaddingBottom = 10, PaddingLeft = 10, PaddingRight = 10, PaddingTop = 10 });
                        MedicalHelathAllergiesTable.AddCell(new PdfPCell(new Phrase(" ")) { Colspan = 6, HorizontalAlignment = 1, Border = Rectangle.TOP_BORDER });

                        tableMedicalHelath.DeleteBodyRows();


                    }
                }
                else
                {
                    MedicalHelathAllergiesTable.AddCell(new PdfPCell(new Phrase("Diagnosis Date")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    MedicalHelathAllergiesTable.AddCell(new PdfPCell(new Phrase("Code")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    MedicalHelathAllergiesTable.AddCell(new PdfPCell(new Phrase("Description")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    MedicalHelathAllergiesTable.AddCell(new PdfPCell(new Phrase("Type")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    MedicalHelathAllergiesTable.AddCell(new PdfPCell(new Phrase("Allergy Name")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    MedicalHelathAllergiesTable.AddCell(new PdfPCell(new Phrase("No Records")) { Colspan = 6, HorizontalAlignment = 1, PaddingBottom = 10 });
                }

                PdfPCell cell24 = new PdfPCell(new Phrase("Expired Diagnosis"));
                cell24.Colspan = 5;
                cell24.BackgroundColor = new BaseColor(208, 249, 249);
                cell24.HorizontalAlignment = 1;
                MedicalHelathExpTable.SpacingBefore = 30f;
                MedicalHelathExpTable.AddCell(cell24);


                if (MedicalHealthExpired.Rows.Count > 0)
                {
                    for (int i = 0; i < MedicalHealthExpired.Rows.Count; i++)
                    {
                        DataRow _expired = MedicalHealthExpired.Rows[i];
                        MedicalHelathExpTable.AddCell(new PdfPCell(new Phrase("Diagnosis Date")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        MedicalHelathExpTable.AddCell(new PdfPCell(new Phrase("Code")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        MedicalHelathExpTable.AddCell(new PdfPCell(new Phrase("Description")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        MedicalHelathExpTable.AddCell(new PdfPCell(new Phrase("Type")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        MedicalHelathExpTable.AddCell(new PdfPCell(new Phrase("Expiration Date")) { BackgroundColor = new BaseColor(208, 249, 249) });

                        if (_expired["DiagnosisDate"] != null)
                        {
                            MedicalHelathExpTable.AddCell(new Phrase(_expired["DiagnosisDate"].ToString(), fntTableFont));
                        }
                        else
                        {
                            MedicalHelathExpTable.AddCell(new Phrase(" ", fntTableFont));
                        }
                        if (_expired["Code"] != null)
                        {
                            MedicalHelathExpTable.AddCell(new Phrase(_expired["Code"].ToString(), fntTableFont));
                        }
                        else
                        {
                            MedicalHelathExpTable.AddCell(new Phrase(" ", fntTableFont));
                        }
                        if (_expired["Description"] != null)
                        {
                            MedicalHelathExpTable.AddCell(new Phrase(_expired["Description"].ToString(), fntTableFont));
                        }
                        else
                        {
                            MedicalHelathExpTable.AddCell(new Phrase(" ", fntTableFont));
                        }
                        if (_expired["Type"] != null)
                        {
                            MedicalHelathExpTable.AddCell(new Phrase(_expired["Type"].ToString(), fntTableFont));
                        }
                        else
                        {
                            MedicalHelathExpTable.AddCell(new Phrase(" ", fntTableFont));
                        }

                        if (_expired["ExpirationDate"] != null)
                        {
                            MedicalHelathExpTable.AddCell(new Phrase(_expired["ExpirationDate"].ToString(), fntTableFont));
                        }
                        else
                        {
                            MedicalHelathExpTable.AddCell(new Phrase(" ", fntTableFont));
                        }


                        MedicalHelathExpTable.AddCell(new PdfPCell(tableMedicalHelath) { Colspan = 5, HorizontalAlignment = 1, PaddingBottom = 10, PaddingLeft = 10, PaddingRight = 10, PaddingTop = 10 });
                        MedicalHelathExpTable.AddCell(new PdfPCell(new Phrase(" ")) { Colspan = 5, HorizontalAlignment = 1, Border = Rectangle.TOP_BORDER });

                        tableMedicalHelath.DeleteBodyRows();
                    }
                }
                else
                {
                    MedicalHelathExpTable.AddCell(new PdfPCell(new Phrase("Diagnosis Date")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    MedicalHelathExpTable.AddCell(new PdfPCell(new Phrase("Code")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    MedicalHelathExpTable.AddCell(new PdfPCell(new Phrase("Description")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    MedicalHelathExpTable.AddCell(new PdfPCell(new Phrase("Type")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    MedicalHelathExpTable.AddCell(new PdfPCell(new Phrase("Expiration Date")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    MedicalHelathExpTable.AddCell(new PdfPCell(new Phrase("No Records")) { Colspan = 5, HorizontalAlignment = 1, PaddingBottom = 10 });
                }

                PdfPCell cell3 = new PdfPCell(new Phrase("Guardianship and Advocacy"));
                cell3.Colspan = 6;
                cell3.BackgroundColor = new BaseColor(208, 249, 249);
                cell3.HorizontalAlignment = 1;
                GuardianshipTable.SpacingBefore = 30f;
                GuardianshipTable.AddCell(cell3);
                if (GuardianshipAndAdvocacy.Rows.Count > 0)
                {
                    DataRow guardian = GuardianshipAndAdvocacy.Rows[0];
                    Guardianship.AddCell(new PdfPCell(new Phrase("No guardian or representative")) { PaddingBottom = 10 });
                    Guardianship.AddCell(new PdfPCell(new Phrase(guardian["NoActiveGuardian"].ToString(), fntTableFont)) { PaddingBottom = 10 });
                    Guardianship.AddCell(new PdfPCell(new Phrase("Is capable and makes own decisions")) { PaddingBottom = 10 });
                    Guardianship.AddCell(new PdfPCell(new Phrase(guardian["NotApplicableGuardian"].ToString(), fntTableFont)) { PaddingBottom = 10 });
                }
                else
                {
                    Guardianship.AddCell(new PdfPCell(new Phrase("No guardian or representative")) { PaddingBottom = 10 });
                    Guardianship.AddCell(new PdfPCell(new Phrase("", fntTableFont)) { PaddingBottom = 10 });
                    Guardianship.AddCell(new PdfPCell(new Phrase("Is capable and makes own decisions")) { PaddingBottom = 10 });
                    Guardianship.AddCell(new PdfPCell(new Phrase("", fntTableFont)) { PaddingBottom = 10 });
                }
                if (GuardianshipAndAdvocacyGrid.Rows.Count > 0)
                {
                    GuardianshipTable.AddCell(new PdfPCell(Guardianship) { Colspan = 9, HorizontalAlignment = 1, PaddingBottom = 10, PaddingLeft = 10, PaddingRight = 10, PaddingTop = 10 });
                    GuardianshipTable.AddCell(new PdfPCell(new Phrase(" ")) { Colspan = 9, HorizontalAlignment = 1, Border = Rectangle.TOP_BORDER });
                    Guardianship.DeleteBodyRows();
                    for (int i = 0; i < GuardianshipAndAdvocacyGrid.Rows.Count; i++)
                    {
                        DataRow _guardian = GuardianshipAndAdvocacyGrid.Rows[i];

                        GuardianshipTable.AddCell(new PdfPCell(new Phrase("Help To Make Decision Life")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        GuardianshipTable.AddCell(new PdfPCell(new Phrase("Person's level of involvement with the member")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        GuardianshipTable.AddCell(new PdfPCell(new Phrase("Person help the member make decisions")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        GuardianshipTable.AddCell(new PdfPCell(new Phrase("Contact supports the member to make decisions")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        GuardianshipTable.AddCell(new PdfPCell(new Phrase("Guardianship")) { BackgroundColor = new BaseColor(208, 249, 249) });
                        GuardianshipTable.AddCell(new PdfPCell(new Phrase("Other Involement With Member")) { BackgroundColor = new BaseColor(208, 249, 249) });



                        GuardianshipTable.AddCell(new Phrase(_guardian["HelpMemberMakeDecisionInLife"].ToString(), fntTableFont));
                        GuardianshipTable.AddCell(new Phrase(_guardian["PersonHelpMemberMakeDecision"].ToString(), fntTableFont));
                        GuardianshipTable.AddCell(new Phrase(_guardian["PersonInvolvementWithMember"].ToString(), fntTableFont));
                        GuardianshipTable.AddCell(new Phrase(_guardian["HelpSignApproveLifePlanName"].ToString() + ", " + _guardian["HelpSignApproveFinancialName"].ToString() + ", " + _guardian["HelpSignApproveMedicalName"].ToString() + ", " + _guardian["OtherName"].ToString(), fntTableFont));
                        GuardianshipTable.AddCell(new Phrase(_guardian["GuardianshipProofName"].ToString(), fntTableFont));
                        GuardianshipTable.AddCell(new Phrase(_guardian["OtherInvolementWithMember"].ToString(), fntTableFont));



                    }
                    GuardianshipTable.AddCell(new PdfPCell(new Phrase(" ")) { Colspan = 6, HorizontalAlignment = 1, Border = Rectangle.TOP_BORDER });
                }
                else
                {
                    GuardianshipTable.AddCell(new PdfPCell(Guardianship) { Colspan = 9, HorizontalAlignment = 1, PaddingBottom = 10, PaddingLeft = 10, PaddingRight = 10, PaddingTop = 10 });
                    GuardianshipTable.AddCell(new PdfPCell(new Phrase(" ")) { Colspan = 9, HorizontalAlignment = 1, Border = Rectangle.TOP_BORDER });
                    Guardianship.DeleteBodyRows();
                    GuardianshipTable.AddCell(new PdfPCell(new Phrase("HelpToMakeDecisionLife")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    GuardianshipTable.AddCell(new PdfPCell(new Phrase("HowHelpToMakeDecisions")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    GuardianshipTable.AddCell(new PdfPCell(new Phrase("PersonInvolvementWithMembers")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    GuardianshipTable.AddCell(new PdfPCell(new Phrase("SupportsIndividualDecision")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    GuardianshipTable.AddCell(new PdfPCell(new Phrase("Guardianship")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    GuardianshipTable.AddCell(new PdfPCell(new Phrase("OtherInvolementWithMember")) { BackgroundColor = new BaseColor(208, 249, 249) });
                    GuardianshipTable.AddCell(new PdfPCell(new Phrase("No Records")) { Colspan = 6, HorizontalAlignment = 1, PaddingBottom = 10 });
                }

                var pagesize = new iTextSharp.text.Rectangle(iTextSharp.text.PageSize.LETTER);
                pagesize.BackgroundColor = iTextSharp.text.BaseColor.WHITE;
                var left_margin = 15;
                var top_margin = 25;
                var bottom_margin = 25;

                iTextSharp.text.Document doc = new iTextSharp.text.Document(pagesize, left_margin, 10, top_margin, bottom_margin);
                PdfWriter writer = PdfWriter.GetInstance(doc, new FileStream(medications, FileMode.Create));
                iTextSharp.text.Font mainFont = new iTextSharp.text.Font();
                iTextSharp.text.Font boldFont = new iTextSharp.text.Font();
                mainFont = FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.NORMAL);
                boldFont = FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD);
                doc.Open();

                doc.Add(Medications);
                doc.Close();
                writer.Dispose();
                writer.Close();


                iTextSharp.text.Document doc1 = new iTextSharp.text.Document(pagesize, left_margin, 10, top_margin, bottom_margin);
                PdfWriter writer1 = PdfWriter.GetInstance(doc1, new FileStream(circleOfSupport, FileMode.Create));
                iTextSharp.text.Font mainFont1 = new iTextSharp.text.Font();
                iTextSharp.text.Font boldFont1 = new iTextSharp.text.Font();
                mainFont1 = FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.NORMAL);
                boldFont1 = FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD);
                doc1.Open();

                doc1.Add(CircleOfSupportTable);
                doc1.Close();
                writer1.Dispose();
                writer1.Close();

                iTextSharp.text.Document doc2 = new iTextSharp.text.Document(pagesize, left_margin, 10, top_margin, bottom_margin);
                PdfWriter writer2 = PdfWriter.GetInstance(doc2, new FileStream(medicalHealth, FileMode.Create));
                iTextSharp.text.Font mainFont2 = new iTextSharp.text.Font();
                iTextSharp.text.Font boldFont2 = new iTextSharp.text.Font();
                mainFont2 = FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.NORMAL);
                boldFont2 = FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD);
                doc2.Open();

                doc2.Add(MedicalHelathTable);
                doc2.Add(MedicalHelathAllergiesTable);
                doc2.Add(MedicalHelathExpTable);
                doc2.Close();
                writer2.Dispose();
                writer2.Close();

                iTextSharp.text.Document doc3 = new iTextSharp.text.Document(pagesize, left_margin, 10, top_margin, bottom_margin);
                PdfWriter writer3 = PdfWriter.GetInstance(doc3, new FileStream(guardianship, FileMode.Create));
                iTextSharp.text.Font mainFont3 = new iTextSharp.text.Font();
                iTextSharp.text.Font boldFont3 = new iTextSharp.text.Font();
                mainFont3 = FontFactory.GetFont("Arial", 10, iTextSharp.text.Font.NORMAL);
                boldFont3 = FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD);
                doc3.Open();

                doc3.Add(GuardianshipTable);
                doc3.Close();
                writer3.Dispose();
                writer3.Close();



                //newFile=ExistingPdfFile,final1Doc=OutputPdfFile,AddNewPage,DestinationPageNumber

                AddPageInExistingPDFFile(newFile, final1Doc, circleOfSupport, 3);
                AddPageInExistingPDFFile(final1Doc, final2Doc, guardianship, 3 + _pagenumber);
                AddPageInExistingPDFFile(final2Doc, fina3Doc, medicalHealth, 11 + _pagenumber);
                AddPageInExistingPDFFile(fina3Doc, fina4Doc, medications, 17 + _pagenumber);

                PdfReader readerNew = new PdfReader(fina4Doc);
                PdfStamper stamperNew = new PdfStamper(readerNew, new FileStream(fina5Doc, FileMode.Create));

                iTextSharp.text.Font pageTextFont1 = FontFactory.GetFont("Arial", 8, iTextSharp.text.Font.BOLD, BaseColor.BLACK);
                DateTime currentTime = TimeZoneInfo.ConvertTime(DateTime.Now, TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time"));
                for (int i = 1; i <= readerNew.NumberOfPages; i++)
                {

                    ColumnText.ShowTextAligned(stamperNew.GetOverContent(i), Element.ALIGN_RIGHT, new Phrase("Page " + i.ToString() + " of " + readerNew.NumberOfPages, pageTextFont1), 590f, 3f, 0);
                    ColumnText.ShowTextAligned(stamperNew.GetOverContent(i), Element.ALIGN_LEFT, new Phrase("Printed on " + currentTime.ToString("MM/dd/yyyy hh:mm tt"), pageTextFont1), 2f, 3f, 0);

                }
                stamperNew.FormFlattening = true;
                stamperNew.Dispose();
                stamperNew.Close();
                readerNew.Dispose();
                readerNew.Close();

                dataTable.Clear();
                dataTable.Columns.Add("FileName");
                DataRow dataRow = dataTable.NewRow();
                dataRow["FileName"] = fina5Doc;
                dataTable.Rows.Add(dataRow);


                return dataTable;
            }
            catch (Exception Ex)
            {
                pdfStamper.Dispose();
                pdfStamper.Close();
                throw Ex;
            }
            finally
            {
                if (File.Exists(pdfPath))
                {
                    File.Delete(pdfPath);
                }
                if (File.Exists(newFile))
                {
                    File.Delete(newFile);
                }
                if (File.Exists(circleOfSupport))
                {
                    File.Delete(circleOfSupport);
                }
                if (File.Exists(medicalHealth))
                {
                    File.Delete(medicalHealth);
                }
                if (File.Exists(medications))
                {
                    File.Delete(medications);
                }
                if (File.Exists(guardianship))
                {
                    File.Delete(guardianship);
                }
                //if (File.Exists(finalDoc)){
                //    File.Delete(finalDoc);
                //}
                if (File.Exists(final1Doc))
                {
                    File.Delete(final1Doc);
                }
                if (File.Exists(final2Doc))
                {
                    File.Delete(final2Doc);
                }
                if (File.Exists(fina3Doc))
                {
                    File.Delete(fina3Doc);
                }
                if (File.Exists(fina4Doc))
                {
                    File.Delete(fina4Doc);
                }


            }


        }
		 private void fillCCOComprehensiveAssessmentSection(AcroFields pdfFormFields, DataTable dataSetFillPDF)
        {
            DataTable dataTableComprehensiveAssessment;
            try
            {
                if (dataSetFillPDF.Rows.Count > 0)
                {
                    dataTableComprehensiveAssessment = dataSetFillPDF;
                    DataRow row = dataTableComprehensiveAssessment.Rows[0];

                    pdfFormFields.SetField("ClientId", row["ClientName"].ToString());
                    pdfFormFields.SetField("IndividualMiddleName", row["IndividualMiddleName"].ToString());
                    pdfFormFields.SetField("IndividualSuffix", row["IndividualSuffix"].ToString());
                    pdfFormFields.SetField("Nickname", row["Nickname"].ToString());
                    pdfFormFields.SetField("TABSId", row["TABSId"].ToString());
                    pdfFormFields.SetField("MedicaidId", row["MedicaidId"].ToString());
                    pdfFormFields.SetField("DateofBirth", row["DateofBirth"].ToString());
                    pdfFormFields.SetField("Gender", row["Gender"].ToString());
                    pdfFormFields.SetField("PreferredGender", row["PreferredGenderName"].ToString());
                    pdfFormFields.SetField("Race", row["Race"].ToString());
                    pdfFormFields.SetField("Ethnicity", row["Ethnicity"].ToString());
                    pdfFormFields.SetField("PhoneNumber", row["PhoneNumber"].ToString());
                    pdfFormFields.SetField("StreetAddress1", row["StreetAddress1"].ToString());
                    pdfFormFields.SetField("StreetAddress2", row["StreetAddress2"].ToString());
                    pdfFormFields.SetField("City", row["City"].ToString());
                    pdfFormFields.SetField("State", row["State"].ToString());
                    pdfFormFields.SetField("ZIPCode", row["ZIPCode"].ToString());
                    pdfFormFields.SetField("LivingSituation", row["LivingSituation"].ToString());
                    pdfFormFields.SetField("WillowbrookStatus", row["WillowbrookStatus"].ToString());
                    pdfFormFields.SetField("RepresentationStatus", row["RepresentationStatus"].ToString());
                    pdfFormFields.SetField("CABRepContact1", row["CABRepContact1"].ToString());
                    pdfFormFields.SetField("CABRepContact2", row["CABRepContact2"].ToString());
                    pdfFormFields.SetField("ExpectationsforCommunityInclusion", row["ExpectationsforCommunityInclusion"].ToString());
                    pdfFormFields.SetField("HospitalStaffingCoverage", row["HospitalStaffingCoverage"].ToString());
                    pdfFormFields.SetField("PATHSMeetingDate", row["PATHSMeetingDate"].ToString());
                    pdfFormFields.SetField("Version", row["DocumentVersion"].ToString());
                    pdfFormFields.SetField("Status", row["DocumentStatus"].ToString());

                }

            }
            catch (Exception Ex)
            {
                throw Ex;
            }
        }

