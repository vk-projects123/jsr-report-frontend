import { useState, useEffect } from 'react';
import styled from 'styled-components';
import html2pdf from 'html2pdf.js';
import pdflogo from "../../images/pdflogo.jpg";
import { FaDownload } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { VIEW_REPORTS_API, SUBMIT_REPORT_API, imgUrl } from "../../Api/api.tsx";
import moment from 'moment';
import { toast } from "react-toastify";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #fff;
  padding: 20px;
  @media (max-width: 600px) {
    padding: 10px;
  }
`;

const HeaderRow = styled.div`
border: 1px solid black;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const LogoContainer = styled.div`
border-right: 1px solid black;
  width: 150px; /* Default width */
  margin-right: 20px;
  height: 100%;

  @media (max-width: 1200px) {
    width: 120px; /* Adjust for medium screens */
  }

  @media (max-width: 900px) {
    width: 100px; /* Adjust for smaller screens */
  }

  @media (max-width: 600px) {
    width: 80px; /* Adjust for mobile screens */
  }
`;

const TitleContainer = styled.div`
  flex: 1;
  text-align: center;
  font-size: 18px;

  @media (max-width: 1200px) {
    font-size: 16px; /* Adjust for medium screens */
  }

  @media (max-width: 900px) {
    font-size: 14px; /* Adjust for smaller screens */
  }

  @media (max-width: 600px) {
    font-size: 12px; /* Adjust for mobile screens */
  }
`;

const ReportDetails = styled.div`
height:100%;
padding:16px;
  border-left: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column; 
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableCell = styled.td`
  border: 1px solid black;
  padding-left:5px;
  text-align: left;
  vertical-align: middle;
  margin: 1px;
  overflow: auto; 
  img {
    max-width: 100%; /* Ensure images fit within the cell */
    height: auto; /* Maintain aspect ratio */
  }
`;

const HeaderCell = styled(TableCell)`
padding-left:5px;
  background: rgb(216, 216, 216);
  font-weight: bold;
  max-width: 50%; /* Set maximum width to 50% */
  overflow: hidden; /* Hide overflow content */
  text-overflow: ellipsis; /* Add ellipsis for overflow text */
  white-space: nowrap; /* Prevent text from wrapping */
`;

const Title = styled.p`
  margin: 0;
  font-size: 15px;
  font-family: "Carlito", sans-serif;
  font-weight: bold;
  margin-top: 0;
  margin-right: 0;
  margin-bottom: 2.1pt;
`;

const DownloadButton = styled.button`
  margin: 20px 0;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute; /* Position the button absolutely */
  right: 20px; /* Adjust this value to control distance from the right */
  top: 70px; /* Adjust this value to control distance from the top */

  &:hover {
    background-color: #0056b3;
  }

  svg {
    margin-right: 5px; /* Adds spacing between the icon and text */
  }
`;

const PreviewReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const Datas = location.state;
  const data = Datas.data;
  var reporttype: any;
  var submissionID: any;
  var formId: any;
  try {
    reporttype = Datas.reporttype;
    submissionID = Datas.submissionID;
    formId = Datas.formId;
  } catch (e) {
    reporttype = "IPQC";
    submissionID = 0;
    formId = 1;
  }

  const handleBackButton = () => {
    console.log("back button pressed!");
    navigate('/reports/running_report/1', { state: { formId:formId,reporttype: reporttype, submissionID: submissionID } });
  };

  var utoken = localStorage.getItem('userToken');
  const [isLoaded, setLoaded] = useState(false);
  var [reportData, setReportdata] = useState([]);

  useEffect(() => {
    setLoaded(true);
    listsectiondatas();
  }, []);

  // Function to fetch sections
  const listsectiondatas = async () => {

    const params = new URLSearchParams({
      form_id: formId,
      report_type: reporttype,
      submission_id: submissionID
    });

    try {
      const response = await fetch(`${VIEW_REPORTS_API}?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${utoken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (data.Status === 0) {
        setLoaded(false);
      } else if (data.Status === 1) {
        console.log(data.info);
        setReportdata(data.info || []);
        setLoaded(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setLoaded(false);
    }
  };

  const [isClick, setIsclick] = useState(false);

  const generatePDF = async () => {
    setIsclick(true);
    const input = document.getElementById('report') as HTMLElement;

    // Apply styles to all spans within tables
    const spans = document.querySelectorAll('table span');
    spans.forEach((text) => {
      text.classList.add('pdf-span'); // Add the class
    });

    if (input) {
      const options = {
        filename: 'inspection_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2, // Improves quality
          useCORS: true, // Fix cross-origin issues for images
          scrollX: 0, scrollY: 0,  // Avoid scroll offsets
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      // Wait for all images to load
      const images = input.getElementsByTagName('img');
      const imagePromises = Array.from(images).map((img) => {
        if (img.complete) {
          return Promise.resolve();
        } else {
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
        }
      });

      try {
        // Wait for all images to load
        await Promise.all(imagePromises);

        // Add a small delay (e.g., 500ms) to ensure rendering is complete
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Generate the PDF
        await html2pdf().set(options).from(input).save();

        // Remove the class after PDF generation is complete
        spans.forEach((text) => {
          text.classList.remove('pdf-span'); // Remove the class
        });
      } catch (error) {
        console.error("Error generating PDF:", error);
        // Optionally, remove the class even if there's an error
        spans.forEach((text) => {
          text.classList.remove('pdf-span'); // Remove the class
        });
      } finally {
        setIsclick(false);
      }
    }
  };

  const submitReport = async (e: any) => {
    e.preventDefault();
    if (submissionID == 0) {
      toast.error("please fill atleast one section");
    } else {
      try {
        const response = await fetch(SUBMIT_REPORT_API, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${utoken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body:JSON.stringify({
            submission_id: submissionID
          })
        });

        const data = await response.json();

        if (data.Status === 0) {
          setLoaded(false);
        } else if (data.Status === 1) {
          toast.success("Report Submitted Success");
          navigate(`/reports/${reporttype}`);
          setLoaded(false);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        setLoaded(false);
      }
    }
  };

  return (
    <>
      <div style={{ height: 40 }}></div>
      <DownloadButton onClick={generatePDF}><FaDownload />PDF</DownloadButton>
      <button className="add-btn mx-2" onClick={handleBackButton}>
        Back
      </button>
      {submissionID != 0 ? <button className="add-btn mx-2" onClick={submitReport}>
        Submit Report
      </button> : ""}
      {reporttype === "IPQC" ?
        <div>
          {/* content */}
          {reportData.length <= 0 ? "Report Empty" : <Container id="report">
            {/* page 1 start */}
            <div className="content" style={{ height: isClick ? '150vh' : "" }}>
              {/* header */}
              <HeaderRow id="header" className="pdf-header">
                <LogoContainer>
                  <img src={pdflogo} alt="PDF Logo" style={{ padding: 5, margin: 5 }} />
                </LogoContainer>
                <TitleContainer>
                  <strong className={isClick ? 'pdf-span' : ""}>In Process Inspection Daily Report</strong>
                </TitleContainer>
                <ReportDetails>
                  <div>Report Date: {moment(reportData[0].value.find(item => item.param_name === "Date")?.value).format('DD-MM-YYYY')}</div>
                  <div>Report No: {reportData[0].value.find(item => item.param_name === "Report No")?.value}</div>
                </ReportDetails>
              </HeaderRow>

              {/* Report Details */}
              <div className="avoid-break" id="reportDetails">
                <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Report Details –</p>
                <Table>
                  <tbody>
                    {reportData[0].value.map((item, index) => {
                      // Check if the index is even to start a new row
                      if (index % 2 === 0) {
                        return (
                          <tr key={index}>
                            {/* First column */}
                            <HeaderCell style={{ width: '25%' }}><span><strong>{reportData[0].value[index].param_name}</strong></span></HeaderCell>
                            <TableCell style={{ width: '25%' }}><span>{reportData[0].value[index].value}</span></TableCell>
                            {/* Second column */}
                            {reportData[0].value[index + 1] && (
                              <>
                                <HeaderCell style={{ width: '25%' }}><span><strong>{reportData[0].value[index + 1].param_name}</strong></span></HeaderCell>
                                <TableCell style={{ width: '25%' }}><span>{reportData[0].value[index + 1].value}</span></TableCell>
                              </>
                            )}
                          </tr>
                        );
                      }
                      return null; // Skip odd indices since they are handled in the previous iteration
                    })}
                  </tbody>
                </Table>
              </div>

              {/* Production Stage Wise */}
              <div className="avoid-break" id="productionStageWise">
                <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Production Stage Wise -</p>
                <Table>
                  <tbody style={{ margin: 0, padding: 0 }}>
                    {reportData[1].value.map((item, index) => (
                      <tr key={index}>
                        <HeaderCell style={{ width: "50%" }}><span><strong>{item.param_name}</strong></span></HeaderCell>
                        <TableCell><span>{item.value}</span></TableCell>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>

            {/* Footer */}
            {isClick ? <div id="footer" style={{ width: '100%' }}>
              <Table style={{ width: '100%' }}>
                <tbody>
                  <tr style={{ margin: 0, padding: 0 }}>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Format No: JSR/SI</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Rev Date and No: 00</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Compiled By: Sanket Thakkar</span>
                    </TableCell>
                  </tr>
                </tbody>
              </Table>
            </div> : ""}

            {/* page 1 end */}

            {/* page 2 start */}
            <div className="page-break"></div>

            {/* header */}
            <div className="content" style={{ height: isClick ? '157vh' : "" }}>
              {isClick ? <HeaderRow id="header" className="pdf-header" style={{ marginTop: 20 }}>
                <LogoContainer>
                  <img src={pdflogo} alt="PDF Logo" style={{ padding: 5, margin: 5 }} />
                </LogoContainer>
                <TitleContainer>
                  <strong className='pdf-span'>In Process Inspection Daily Report</strong>
                </TitleContainer>
                <ReportDetails>
                  <div className='pdf-span'>Report Date: {moment(reportData[0].value.find(item => item.param_name === "Date")?.value).format('DD-MM-YYYY')}</div>
                  <div className='pdf-span'>Report No: {reportData[0].value.find(item => item.param_name === "Report No")?.value}</div>
                </ReportDetails>
              </HeaderRow> : ""}

              {/* Major Observations of the Day */}
              <div className="avoid-break" id="majorObservations">
                <Title className={isClick ? "pdf-span" : ""}>Major Observations of the Day –</Title>
                <Table>
                  <tbody style={{ margin: 0, padding: 0 }}>
                    <tr style={{ margin: 0, padding: 0 }}>
                      <HeaderCell><span><strong>Sr No</strong></span></HeaderCell>
                      <HeaderCell colSpan={2}><span><strong>Observations / Deficiency Details</strong></span></HeaderCell>
                    </tr>
                    {reportData[2].value.map((observation: any, index: any) => (
                      <>
                        <tr key={index}>
                          <TableCell rowSpan={2}><span><strong>{index + 1}</strong></span></TableCell>
                          <TableCell colSpan={2}><span>{observation.observations_text}</span></TableCell>
                        </tr>
                        <tr>
                          {observation.images.map((image: any, idx: any) => (
                            <TableCell key={idx}>
                              {/* Correctly concatenate imgUrl with image.image */}
                              <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{ padding: 5, height: 300 }} />
                            </TableCell>
                          ))}
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>

            {/* footer */}
            {isClick ? <div id="footer" style={{ width: '100%' }}>
              <Table style={{ width: '100%' }}>
                <tbody>
                  <tr style={{ margin: 0, padding: 0 }}>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Format No: JSR/SI</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Rev Date and No: 00</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Compiled By: Sanket Thakkar</span>
                    </TableCell>
                  </tr>
                </tbody>
              </Table>
            </div> : ""}
            {/* page 2 end */}

            {/* page 3 start */}
            <div className="page-break"></div>

            {/* header */}
            <div className="content" style={{ height: isClick ? '157vh' : "" }}>
              {isClick ? <HeaderRow id="header" className="pdf-header" style={{ marginTop: 20 }}>
                <LogoContainer>
                  <img src={pdflogo} alt="PDF Logo" style={{ padding: 5, margin: 5 }} />
                </LogoContainer>
                <TitleContainer>
                  <strong className='pdf-span'>In Process Inspection Daily Report</strong>
                </TitleContainer>
                <ReportDetails>
                  <div className='pdf-span'>Report Date: {moment(reportData[0].value.find(item => item.param_name === "Date")?.value).format('DD-MM-YYYY')}</div>
                  <div className='pdf-span'>Report No: {reportData[0].value.find(item => item.param_name === "Report No")?.value}</div>
                </ReportDetails>
              </HeaderRow> : ""}

              {/* Process – Film Cutting */}
              <div className="avoid-break" id="productionDetails">
                <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', fontSize: 18 }}>In Process Inspection Report –</p>
                <br />
                <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Process – Film Cutting</p>
                <Table>
                  <tbody style={{ margin: 0, padding: 0 }}>
                    <tr>
                      <HeaderCell><span><strong>Parameters</strong></span></HeaderCell>
                      {/* Dynamically render round columns based on data */}
                      {Object.keys(reportData[3].value[0].value).map((round, index) => {
                        // Check if any row has data for this round
                        const hasData = reportData[3].value.some(item => item.value[round] !== "");
                        if (hasData) {
                          return (
                            <TableCell key={index}><span><strong>{`Round ${index + 1}`}</strong></span></TableCell>
                          );
                        }
                        return null; // Skip rendering if no data for this round
                      })}
                    </tr>
                    {reportData[3].value.map((item, index) => (
                      <tr key={index}>
                        <HeaderCell><span><strong>{item.param_name}</strong></span></HeaderCell>
                        {Object.keys(item.value).map((round, idx) => {
                          // Check if this round has data
                          if (item.value[round] !== "") {
                            return (
                              <TableCell key={idx}><span>{item.value[round]}</span></TableCell>
                            );
                          }
                          return null; // Skip rendering if no data for this round
                        })}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Process – Tabber & Stringer */}
              <div className="avoid-break">
                <div className="avoid-break" id="productionDetails">
                  <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Process – Tabber & Stringer</p>
                  <Table>
                    <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '5px' }}><strong>Parameters</strong></th>
                        {/* Dynamically render round columns based on data */}
                        {Object.keys(reportData[4].value[0].value).map((round, index) => {
                          // Check if any row has data for this round
                          const hasData = reportData[4].value.some(item => item.value[round] !== "");
                          if (hasData) {
                            return (
                              <th key={index} style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>
                                <strong>{`Round ${index + 1}`}</strong>
                              </th>
                            );
                          }
                          return null; // Skip rendering if no data for this round
                        })}
                      </tr>
                      {reportData[4].value.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>{row.param_name}</strong></span></td>
                          {Object.keys(row.value).map((round, index) => {
                            // Check if this round has data
                            if (row.value[round] !== "") {
                              return (
                                <td key={index} style={{ border: '1px solid black', padding: '5px' }}>
                                  <span>{row.value[round]}</span>
                                </td>
                              );
                            }
                            return null; // Skip rendering if no data for this round
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* Process – Layup */}
              <div className="avoid-break" id="productionDetails">
                <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Process – Layup</p>
                <Table>
                  <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
                    <tr>
                      <th style={{ border: '1px solid black', padding: '5px' }}><strong>Parameters</strong></th>
                      {/* Dynamically render round columns based on data */}
                      {Object.keys(reportData[5].value[0].value).map((round, index) => {
                        // Check if any row has data for this round
                        const hasData = reportData[5].value.some(item => item.value[round] !== "");
                        if (hasData) {
                          return (
                            <th key={index} style={{ border: '1px solid black', padding: '5px' }}>
                              <strong>{`Round ${index + 1}`}</strong>
                            </th>
                          );
                        }
                        return null; // Skip rendering if no data for this round
                      })}
                    </tr>
                    {reportData[5].value.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>{row.param_name}</strong></span></td>
                        {Object.keys(row.value).map((round, index) => {
                          // Check if this round has data
                          if (row.value[round] !== "") {
                            return (
                              <td key={index} style={{ border: '1px solid black', padding: '5px' }}>
                                <span>{row.value[round]}</span>
                              </td>
                            );
                          }
                          return null; // Skip rendering if no data for this round
                        })}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>

            {/* footer */}
            {isClick ? <div id="footer" style={{ width: '100%' }}>
              <Table style={{ width: '100%' }}>
                <tbody>
                  <tr style={{ margin: 0, padding: 0 }}>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Format No: JSR/SI</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Rev Date and No: 00</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Compiled By: Sanket Thakkar</span>
                    </TableCell>
                  </tr>
                </tbody>
              </Table>
            </div> : ""}
            {/* page 3 end */}

            {/* page 4 start */}
            <div className="page-break"></div>

            {/* header */}
            <div className="content" style={{ height: isClick ? '157vh' : "" }}>
              <div className="content">
                {isClick ? <HeaderRow id="header" className="pdf-header" style={{ marginTop: 20 }}>
                  <LogoContainer>
                    <img src={pdflogo} alt="PDF Logo" style={{ padding: 5, margin: 5 }} />
                  </LogoContainer>
                  <TitleContainer>
                    <strong className='pdf-span'>In Process Inspection Daily Report</strong>
                  </TitleContainer>
                  <ReportDetails>
                    <div className='pdf-span'>Report Date: {moment(reportData[0].value.find(item => item.param_name === "Date")?.value).format('DD-MM-YYYY')}</div>
                    <div className='pdf-span'>Report No: {reportData[0].value.find(item => item.param_name === "Report No")?.value}</div>
                  </ReportDetails>
                </HeaderRow> : ""}

                {/* Process – Lamination */}
                <div className="avoid-break" id="productionDetails">
                  <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Process – Lamination</p>
                  <Table>
                    <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '5px' }}><strong>Parameters</strong></th>
                        {/* Dynamically render round columns based on data */}
                        {Object.keys(reportData[6].value[0].value).map((round, index) => {
                          // Check if any row has data for this round
                          const hasData = reportData[6].value.some(item => item.value[round] !== "");
                          if (hasData) {
                            return (
                              <th key={index} style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>
                                <strong>{`Round ${index + 1}`}</strong>
                              </th>
                            );
                          }
                          return null; // Skip rendering if no data for this round
                        })}
                      </tr>
                      {reportData[6].value.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>{row.param_name}</strong></span></td>
                          {Object.keys(row.value).map((round, index) => {
                            // Check if this round has data
                            if (row.value[round] !== "") {
                              return (
                                <td key={index} style={{ border: '1px solid black', padding: '5px' }}>
                                  <span>{row.value[round]}</span>
                                </td>
                              );
                            }
                            return null; // Skip rendering if no data for this round
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>

            {/* footer */}
            {isClick ? <div id="footer" style={{ width: '100%' }}>
              <Table style={{ width: '100%' }}>
                <tbody>
                  <tr style={{ margin: 0, padding: 0 }}>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Format No: JSR/SI</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Rev Date and No: 00</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Compiled By: Sanket Thakkar</span>
                    </TableCell>
                  </tr>
                </tbody>
              </Table>
            </div> : ""}
            {/* page 4 end */}

            {/* page 5 start */}
            <div className="page-break"></div>

            {/* header */}
            <div className="content" style={{ height: isClick ? '157vh' : "" }}>
              <div className="content">
                {isClick ? <HeaderRow id="header" className="pdf-header" style={{ marginTop: 20 }}>
                  <LogoContainer>
                    <img src={pdflogo} alt="PDF Logo" style={{ padding: 5, margin: 5 }} />
                  </LogoContainer>
                  <TitleContainer>
                    <strong className='pdf-span'>In Process Inspection Daily Report</strong>
                  </TitleContainer>
                  <ReportDetails>
                    <div className='pdf-span'>Report Date: {moment(reportData[0].value.find(item => item.param_name === "Date")?.value).format('DD-MM-YYYY')}</div>
                    <div className='pdf-span'>Report No: {reportData[0].value.find(item => item.param_name === "Report No")?.value}</div>
                  </ReportDetails>
                </HeaderRow> : ""}

                {/* Process – Framing */}
                <div className="avoid-break" id="productionDetails">
                  <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Process – Framing</p>
                  <Table>
                    <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '5px' }}><strong>Parameters</strong></th>
                        {/* Dynamically render round columns based on data */}
                        {Object.keys(reportData[7].value[0].value).map((round, index) => {
                          // Check if any row has data for this round
                          const hasData = reportData[7].value.some(item => item.value[round] !== "");
                          if (hasData) {
                            return (
                              <th key={index} style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>
                                <strong>{`Round ${index + 1}`}</strong>
                              </th>
                            );
                          }
                          return null; // Skip rendering if no data for this round
                        })}
                      </tr>
                      {reportData[7].value.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>{row.param_name}</strong></span></td>
                          {Object.keys(row.value).map((round, index) => {
                            // Check if this round has data
                            if (row.value[round] !== "") {
                              return (
                                <td key={index} style={{ border: '1px solid black', padding: '5px' }}>
                                  <span>{row.value[round]}</span>
                                </td>
                              );
                            }
                            return null; // Skip rendering if no data for this round
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>

            {/* footer */}
            {isClick ? <div id="footer" style={{ width: '100%' }}>
              <Table style={{ width: '100%' }}>
                <tbody>
                  <tr style={{ margin: 0, padding: 0 }}>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Format No: JSR/SI</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Rev Date and No: 00</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Compiled By: Sanket Thakkar</span>
                    </TableCell>
                  </tr>
                </tbody>
              </Table>
            </div> : ""}
            {/* page 5 end */}

            {/* page 6 start */}
            <div className="page-break"></div>

            {/* header */}
            <div className="content" style={{ height: isClick ? '157vh' : "" }}>
              <div className="content">
                {isClick ? <HeaderRow id="header" className="pdf-header" style={{ marginTop: 20 }}>
                  <LogoContainer>
                    <img src={pdflogo} alt="PDF Logo" style={{ padding: 5, margin: 5 }} />
                  </LogoContainer>
                  <TitleContainer>
                    <strong className='pdf-span'>In Process Inspection Daily Report</strong>
                  </TitleContainer>
                  <ReportDetails>
                    <div className='pdf-span'>Report Date: {moment(reportData[0].value.find(item => item.param_name === "Date")?.value).format('DD-MM-YYYY')}</div>
                    <div className='pdf-span'>Report No: {reportData[0].value.find(item => item.param_name === "Report No")?.value}</div>
                  </ReportDetails>
                </HeaderRow> : ""}

                {/* Process – Flasher Testing */}
                <div className="avoid-break" id="productionDetails">
                  <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Process – Flasher Testing</p>
                  <Table>
                    <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '5px' }}><strong>Parameters</strong></th>
                        {/* Dynamically render round columns based on data */}
                        {Object.keys(reportData[8].value[0].value).map((round, index) => {
                          // Check if any row has data for this round
                          const hasData = reportData[8].value.some(item => item.value[round] !== "");
                          if (hasData) {
                            return (
                              <th key={index} style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>
                                <strong>{`Round ${index + 1}`}</strong>
                              </th>
                            );
                          }
                          return null; // Skip rendering if no data for this round
                        })}
                      </tr>
                      {reportData[8].value.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>{row.param_name}</strong></span></td>
                          {Object.keys(row.value).map((round, index) => {
                            // Check if this round has data
                            if (row.value[round] !== "") {
                              return (
                                <td key={index} style={{ border: '1px solid black', padding: '5px' }}>
                                  <span>{row.value[round]}</span>
                                </td>
                              );
                            }
                            return null; // Skip rendering if no data for this round
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {/* Random Sample Check */}
                <div className="avoid-break" id="productionDetails">
                  <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Random Sample Check</p>
                  <Table>
                    <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
                      <tr>
                        <th style={{ border: '1px solid black', padding: '5px' }}><strong>Sr No</strong></th>
                        <th style={{ border: '1px solid black', padding: '5px' }}><strong>Test</strong></th>
                        <th style={{ border: '1px solid black', padding: '5px' }}><strong>Module Sr. No.</strong></th>
                        <th style={{ border: '1px solid black', padding: '5px' }}><strong>Results</strong></th>
                      </tr>
                      {reportData[9].value.map((item, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid black', padding: '5px' }}><span>{index + 1}</span></td>
                          <td style={{ border: '1px solid black', padding: '5px' }}><span>{item.test}</span></td>
                          <td style={{ border: '1px solid black', padding: '5px' }}><span>{item.module_sr_no}</span></td>
                          <td style={{ border: '1px solid black', padding: '5px' }}><span>{item.result}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <Table>
                  <tbody style={{ margin: 0, padding: 0 }}>
                    <tr>
                      <HeaderCell style={{ width: "50%" }}><span><strong>Inspection done by</strong></span></HeaderCell>
                      <TableCell><span>{reportData[0].value.find(item => item.param_name === "Report Created By")?.value}</span></TableCell>
                    </tr>
                    <tr>
                      <HeaderCell><span><strong>Checking together with (Customer/Manufacturer representative)</strong></span></HeaderCell>
                      <TableCell><span>{reportData[0].value.find(item => item.param_name === "Customer Name")?.value}</span></TableCell>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>

            {/* footer */}
            {isClick ? <div id="footer" style={{ width: '100%' }}>
              <Table style={{ width: '100%' }}>
                <tbody>
                  <tr style={{ margin: 0, padding: 0 }}>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Format No: JSR/SI</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Rev Date and No: 00</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Compiled By: Sanket Thakkar</span>
                    </TableCell>
                  </tr>
                </tbody>
              </Table>
            </div> : ""}
            {/* page 6 end */}
          </Container>}
        </div>
        :
        <>
          {/* content */}
          <Container id="report">

            {/* page 1 start */}
            <div className="content" style={{ height: isClick ? '157vh' : "" }}>
              {/* header */}
              <HeaderRow id="header" className="pdf-header">
                <LogoContainer>
                  <img src={pdflogo} alt="PDF Logo" style={{ padding: 5, margin: 5 }} />
                </LogoContainer>
                <TitleContainer>
                  <strong className={isClick ? 'pdf-span' : ""}>In Process Inspection Daily Report</strong>
                </TitleContainer>
                <ReportDetails>
                  <div>Report Date:  {moment(data.date).format('DD-MM-YYYY')}</div>
                  <div>Report No:  {data.reportNo}</div>
                </ReportDetails>
              </HeaderRow>

              {/* Report Details */}
              <div className="avoid-break" id="reportDetails">
                <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Report Details –</p>
                <Table>
                  <tbody>
                    <tr>
                      <HeaderCell style={{ width: '25%' }}><span><strong>OA No</strong></span></HeaderCell>
                      <TableCell style={{ width: '25%' }}><span>{data.oaNo}</span></TableCell>
                      <HeaderCell style={{ width: '25%' }}><span><strong>Date</strong></span></HeaderCell>
                      <TableCell style={{ width: '25%' }}><span>{moment(data.date).format('DD-MM-YYYY')}</span></TableCell>
                    </tr>
                    <tr>
                      <HeaderCell><span><strong>Manufacturer</strong></span></HeaderCell>
                      <TableCell><span>{data.manufacturer}</span></TableCell>
                      <HeaderCell><span><strong>Shift</strong></span></HeaderCell>
                      <TableCell><span>{data.shift}</span></TableCell>
                    </tr>
                    <tr>
                      <HeaderCell><span><strong>Place of Inspection</strong></span></HeaderCell>
                      <TableCell><span>{data.placeOfInspection}</span></TableCell>
                      <HeaderCell><span><strong>Customer name</strong></span></HeaderCell>
                      <TableCell><span>{data.customerName}</span></TableCell>
                    </tr>
                    <tr>
                      <HeaderCell><span><strong>Report created by</strong></span></HeaderCell>
                      <TableCell><span>{data.reportCreatedBy}</span></TableCell>
                    </tr>
                  </tbody>
                </Table>
              </div>

              {/* OTHER DETAILS */}
              <div className="avoid-break" id="productionDetails">
                <Table>
                  <tbody style={{ margin: 0, padding: 0 }}>
                    {/* Header Row */}
                    <tr>
                      <HeaderCell style={{ width: '80px' }}><span><strong>Sr. No.</strong></span></HeaderCell>
                      <HeaderCell style={{ width: '150px' }}><span><strong>Component</strong></span></HeaderCell>
                      <HeaderCell><span><strong>Description Field</strong></span></HeaderCell>
                      <HeaderCell><span><strong>Value</strong></span></HeaderCell>
                    </tr>

                    {/* Solar Cell Data */}
                    <tr>
                      <TableCell rowSpan="6"><span>1</span></TableCell>
                      <TableCell rowSpan="6"><span>Solar Cell</span></TableCell>
                      <TableCell><span>MBB Cells</span></TableCell>
                      <TableCell><span>{data.solar_cell.bb_cells}</span></TableCell>
                    </tr>
                    <tr>
                      <TableCell><span>Eff %</span></TableCell>
                      <TableCell><span>{data.solar_cell.efficiency}</span></TableCell>
                    </tr>
                    <tr>
                      <TableCell><span>Size</span></TableCell>
                      <TableCell><span>{data.solar_cell.size}</span></TableCell>
                    </tr>
                    <tr>
                      <TableCell><span>Product Name</span></TableCell>
                      <TableCell><span>{data.solar_cell.product_name}</span></TableCell>
                    </tr>
                    <tr>
                      <TableCell><span>Batch of Manufacturer</span></TableCell>
                      <TableCell><span>{data.solar_cell.batch}</span></TableCell>
                    </tr>
                    <tr>
                      <TableCell><span>Company Make</span></TableCell>
                      <TableCell><span>{data.solar_cell.company_make}</span></TableCell>
                    </tr>

                    {/* Cell Connector Data */}
                    <tr>
                      <TableCell rowSpan="3"><span>2</span></TableCell>
                      <TableCell rowSpan="3"><span>Cell Connector (Ribbon)</span></TableCell>
                      <TableCell><span>Make</span></TableCell>
                      <TableCell><span>{data.cell_connector.make}</span></TableCell>
                    </tr>
                    <tr>
                      <TableCell><span>Diameter / Size</span></TableCell>
                      <TableCell><span>{data.cell_connector.diameter}</span></TableCell>
                    </tr>
                    <tr>
                      <TableCell><span>Batch of Manufacturer</span></TableCell>
                      <TableCell><span>{data.cell_connector.batch}</span></TableCell>
                    </tr>

                    {/* Soldering Flux Data */}
                    <tr>
                      <TableCell rowSpan="4"><span>3</span></TableCell>
                      <TableCell rowSpan="4"><span>Soldering Flux</span></TableCell>
                      <TableCell><span>Make</span></TableCell>
                      <TableCell><span>{data.soldering_flux.make}</span></TableCell>
                    </tr>
                    <tr>
                      <TableCell><span>Model</span></TableCell>
                      <TableCell><span>{data.soldering_flux.model}</span></TableCell>
                    </tr>
                    <tr>
                      <TableCell><span>Batch of Manufacturer</span></TableCell>
                      <TableCell><span>{data.soldering_flux.batch}</span></TableCell>
                    </tr>
                    <tr>
                      <TableCell><span>Date of Manufacturing</span></TableCell>
                      <TableCell><span>{data.soldering_flux.manufacturing_date}</span></TableCell>
                    </tr>

                    {/* Glass Section */}
                    <tr>
                      <TableCell rowSpan="5"><span>4</span></TableCell>
                      <TableCell rowSpan="5"><span>Glass</span></TableCell>
                      <TableCell><span>Make</span></TableCell>
                      <TableCell><span>{data.glass.make}</span></TableCell>
                    </tr>
                    <tr>
                      <TableCell><span>Dimension</span></TableCell>
                      <TableCell><span>{data.glass.dimension}</span></TableCell>
                    </tr>
                    <tr>
                      <TableCell><span>AR Coated Glass</span></TableCell>
                      <TableCell><span>{data.glass.ar_coated}</span></TableCell>
                    </tr>
                    <tr>
                      <TableCell><span>Batch of Manufacturer</span></TableCell>
                      <TableCell><span>{data.glass.batch}</span></TableCell>
                    </tr>
                    <tr>
                      <TableCell><span>Manufacturing Date</span></TableCell>
                      <TableCell><span>{data.glass.manufacturing_date}</span></TableCell>
                    </tr>


                    {/* EVA Section */}
                    <tr>
                      <TableCell rowSpan="4">
                        <span>5</span>
                      </TableCell>
                      <TableCell rowSpan="4">
                        <span>EVA (Front or Back)</span>
                      </TableCell>
                      <TableCell>
                        <span>Make</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.eva.make}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Model</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.eva.model}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Batch of Manufacturer</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.eva.batch}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Manufacturing Date</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.eva.manufacturing_date}</span>
                      </TableCell>
                    </tr>


                    {/* String Connector */}
                    <tr>
                      <TableCell rowSpan="3">
                        <span>6</span>
                      </TableCell>
                      <TableCell rowSpan="3">
                        <span>String Connector (Busbar)</span>
                      </TableCell>
                      <TableCell>
                        <span>Make</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.string_connector.make}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Dimension</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.string_connector.dimension}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Batch of Manufacturer</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.string_connector.batch}</span>
                      </TableCell>
                    </tr>

                  </tbody>
                </Table>
              </div>

            </div>

            {/* Footer */}
            {isClick ? <div id="footer" style={{ width: '100%' }}>
              <Table style={{ width: '100%' }}>
                <tbody>
                  <tr style={{ margin: 0, padding: 0 }}>
                    {/* Ensure all cells have equal width */}
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Format No: JSR/SI</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Rev Date and No: 00</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Compiled By: Sanket Thakkar</span>
                    </TableCell>
                  </tr>
                </tbody>
              </Table>
            </div> : ""}

            {/* page 1 end */}

            {/* page 2 start */}
            {/* <div className="page-break"></div> */}

            {/* header */}
            <div className="content" style={{ height: isClick ? '157vh' : "" }}>
              {isClick ? <HeaderRow id="header" className="pdf-header" style={{ marginTop: 20 }}>
                <LogoContainer>
                  <img src={pdflogo} alt="PDF Logo" style={{ padding: 5, margin: 5 }} />
                </LogoContainer>
                <TitleContainer>
                  <strong className='pdf-span'>In Process Inspection Daily Report</strong>
                </TitleContainer>
                <ReportDetails>
                  <div className='pdf-span'>Report Date:  {moment(data.date).format('DD-MM-YYYY')}</div>
                  <div className='pdf-span'>Report No:  {data.reportNo}</div>
                </ReportDetails>
              </HeaderRow> : ""}

              {/* OTHER DETAILS */}
              <div className="avoid-break" id="productionDetails">
                <Table>
                  <tbody style={{ margin: 0, padding: 0 }}>
                    {/* Back Sheet */}
                    <tr>
                      <TableCell rowSpan="4" style={{ width: '80px' }}>
                        <span>7</span>
                      </TableCell>
                      <TableCell rowSpan="4" style={{ width: '150px' }}>
                        <span>Back Sheet</span>
                      </TableCell>
                      <TableCell>
                        <span>Make</span>
                      </TableCell>
                      <TableCell style={{ minWidth: '53px' }}>
                        <span>{data.back_sheet.make}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Model</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.back_sheet.model}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Batch of Manufacturer</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.back_sheet.batch}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Manufacturing Date</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.back_sheet.manufacturing_date}</span>
                      </TableCell>
                    </tr>

                    {/* Frame */}
                    <tr>
                      <TableCell rowSpan="6">
                        <span>8</span>
                      </TableCell>
                      <TableCell rowSpan="6">
                        <span>Frame</span>
                      </TableCell>
                      <TableCell>
                        <span>Make</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.frame.make}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Dimension of Long Side</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.frame.long_side_dimension}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Dimension of Short Side</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.frame.short_side_dimension}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Punching Location</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.frame.punching_location}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Model</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.frame.model}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Batch of Manufacturer</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.frame.batch}</span>
                      </TableCell>
                    </tr>

                    {/* Junction Box */}
                    <tr>
                      <TableCell rowSpan="2">
                        <span>9</span>
                      </TableCell>
                      <TableCell rowSpan="2">
                        <span>Junction Box</span>
                      </TableCell>
                      <TableCell>
                        <span>Company Make</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.junction_box.company_make}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Batch of Manufacturer</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.junction_box.batch}</span>
                      </TableCell>
                    </tr>

                    {/* Connector */}
                    <tr>
                      <TableCell>
                        <span>10</span>
                      </TableCell>
                      <TableCell>
                        <span>Connector</span>
                      </TableCell>
                      <TableCell>
                        <span>Type</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.connector.type}</span>
                      </TableCell>
                    </tr>

                    {/* Potting for JB */}
                    <tr>
                      <TableCell rowSpan="4">
                        <span>11</span>
                      </TableCell>
                      <TableCell rowSpan="4">
                        <span>Potting for JB</span>
                      </TableCell>
                      <TableCell>
                        <span>Make</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.potting_for_jb.make}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Model</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.potting_for_jb.model}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Batch of Manufacturer</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.potting_for_jb.batch}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Manufacturing Date</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.potting_for_jb.manufacturing_date}</span>
                      </TableCell>
                    </tr>

                    {/* Adhesive for Junction Box */}
                    <tr>
                      <TableCell rowSpan="4">
                        <span>12</span>
                      </TableCell>
                      <TableCell rowSpan="4">
                        <span>Adhesive for Junction Box</span>
                      </TableCell>
                      <TableCell>
                        <span>Make</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.adhesive_for_jb.make}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Model</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.adhesive_for_jb.model}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Batch of Manufacturer</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.adhesive_for_jb.batch}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Manufacturing Date</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.adhesive_for_jb.manufacturing_date}</span>
                      </TableCell>
                    </tr>

                    {/* Insulation Layer Sealant */}
                    <tr>
                      <TableCell rowSpan="2">
                        <span>13</span>
                      </TableCell>
                      <TableCell rowSpan="2">
                        <span>Insulation Layer Sealant</span>
                      </TableCell>
                      <TableCell>
                        <span>Make</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.insulation_layer_sealant.make}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Model</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.insulation_layer_sealant.model}</span>
                      </TableCell>
                    </tr>

                    {/* Bypass Diode */}
                    <tr>
                      <TableCell rowSpan="2">
                        <span>14</span>
                      </TableCell>
                      <TableCell rowSpan="2">
                        <span>Bypass Diode</span>
                      </TableCell>
                      <TableCell>
                        <span>Make</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.bypass_diode.make}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Model</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.bypass_diode.model}</span>
                      </TableCell>
                    </tr>

                    {/* Fixing Tape */}
                    <tr>
                      <TableCell rowSpan="2">
                        <span>15</span>
                      </TableCell>
                      <TableCell rowSpan="2">
                        <span>Fixing Tape</span>
                      </TableCell>
                      <TableCell>
                        <span>Make</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.fixing_tape.make}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Model</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.fixing_tape.model}</span>
                      </TableCell>
                    </tr>

                    {/* Cable */}
                    <tr>
                      <TableCell>
                        <span>16</span>
                      </TableCell>
                      <TableCell>
                        <span>Cable</span>
                      </TableCell>
                      <TableCell>
                        <span>Make & Dimension</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.cable.make_dimension}</span>
                      </TableCell>
                    </tr>

                    {/* RFID */}
                    <tr>
                      <TableCell rowSpan={2}>
                        <span>17</span>
                      </TableCell>
                      <TableCell rowSpan={2}>
                        <span>RFID</span>
                      </TableCell>
                      <TableCell>
                        <span>Company Make</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.rfid.company_make}</span>
                      </TableCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <span>Model No</span>
                      </TableCell>
                      <TableCell>
                        <span>{data.rfid.model_no}</span>
                      </TableCell>
                    </tr>

                  </tbody>
                </Table>
              </div>


            </div>

            {/* footer */}
            {isClick ? <div id="footer" style={{ width: '100%' }}>
              <Table style={{ width: '100%' }}>
                <tbody>
                  <tr style={{ margin: 0, padding: 0 }}>
                    {/* Ensure all cells have equal width */}
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Format No: JSR/SI</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Rev Date and No: 00</span>
                    </TableCell>
                    <TableCell style={{ width: '33.33%' }}>
                      <span className="pdf-span">Compiled By: Sanket Thakkar</span>
                    </TableCell>
                  </tr>
                </tbody>
              </Table>
            </div> : ""}
            {/* page 2 end */}
          </Container>
        </>
      }
    </>
  );
};

export default PreviewReport;