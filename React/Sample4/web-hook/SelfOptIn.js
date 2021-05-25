import React, { useState, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Card from './Card';
import Input from './Input';
import { GET_CURRENT_ORGANIZATION, UPDATE_ORGANIZATION_SELF_OPT_IN } from '../graphql/queries';
import Button from './Button';
import Loader from './Loader';
import Error from './Error';
import { getErrorMessage } from '../util/ErrorUtil';
import { jsPDF } from "jspdf";
import PDFTemplate from './PDFTemplate';
import QRCode from 'qrcode.react';
import '../assets/fonts/Poppins-SemiBold-normal';

const LoaderContainer = styled.div`
  position: absolute;
  top: calc(50vh - 60px);
  left: calc(50vw - 60px);
`;

const Form = styled.form`
`;
const QrCodeContainer = styled.div`
  display: none;
`;

export default function SelfOptIn() {
  const [keyword, setKeyword] = useState('');
  const [phrase, setPhrase] = useState('');
  const { data, loading } = useQuery(GET_CURRENT_ORGANIZATION);
  const [errorMsg, setErrorMsg] = useState('');
  const [updateSelfOptIn, { loading: updateLoading }] = useMutation(UPDATE_ORGANIZATION_SELF_OPT_IN, {
    variables: {
      keyword,
      phrase
    },
    onError(error) {
      setErrorMsg(getErrorMessage(error));
    },
    onCompleted(data) {
      setErrorMsg('');
    },
  });

  useEffect(() => {
    if (data && data.getCurrentOrganization) {
      const { getCurrentOrganization } = data;
      setKeyword(getCurrentOrganization.keyword);
      setPhrase(getCurrentOrganization.phrase);
    }
  }, [data]);

  if (loading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  }

  function generateTemplate() {
    const { keyword, phrase } = currentOrganisation;
    if (keyword && phrase) {
      const qrCodeSvg = document.getElementById("QRCode");
      const pngUrl = qrCodeSvg.toDataURL("image/png");
      const string = renderToStaticMarkup(<PDFTemplate QRCode={pngUrl} organization={currentOrganisation} />);
      var doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
      doc.addFont('Poppins-SemiBold-normal.ttf', 'Poppins', 'normal');
      doc.html(string, {
        callback: function (doc) {
          doc.save('OrganisationTemplate.pdf');
        },
        x: 150,
        y: 32,
        html2canvas: {
          scale: 0.8,
        }
      });
    }
  }

  const { getCurrentOrganization: currentOrganisation } = data;
  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          updateSelfOptIn();
        }}
      >
        <Card>
          <Input
            top
            type="text"
            header="Keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
            maxLength={15}
          />
          <Input
            type="text"
            header="Phrase"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            required
          />

          {errorMsg && (<Error
            error={errorMsg}
            margin="20px 0px 0px 0px"
            position="relative"
            textAlign="left"
          />
          )}
        </Card>
        <Button
          margin="40px 10px"
          text="UPDATE SELF OPT-IN"
          type="submit"
          width="fit-content"
          loading={updateLoading}
        />
        <Button
          margin="40px 10px"
          text="GENERATE TEMPLATE"
          type="button"
          width="fit-content"
          onClick={generateTemplate}
        />
      </Form>
      <QrCodeContainer>
        <QRCode value={`SMSTO:9780265798:${currentOrganisation?.phrase}`} id="QRCode" />
      </QrCodeContainer>
    </>
  );
}