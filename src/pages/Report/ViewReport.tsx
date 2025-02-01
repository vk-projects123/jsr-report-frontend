import { useState, useEffect } from 'react';
import styled from 'styled-components';
import html2pdf from 'html2pdf.js';
import pdflogo from "../../images/pdflogo.jpg";
import { FaDownload } from 'react-icons/fa';
import { VIEW_REPORTS_API, imgUrl } from "../../Api/api.tsx";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

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

const InspectionReport = () => {
  const navigate = useNavigate();
  var reportType = "IPQC";
  const [isClick, setIsclick] = useState(false);
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
      form_id: "1",
      report_type: "IPQC",
      submission_id: "2"
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

  const generatePDF = () => {
    setIsclick(true);
    const input = document.getElementById('report') as HTMLElement;
    // Apply styles to all spans within tables
    const spans = document.querySelectorAll('table span');
    spans.forEach((text) => {
      text.classList.add('pdf-span'); // Add the class
    });

    if (input) {
      const options = { // Adjust margins for spacing
        filename: 'inspection_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2, // Improves quality
          useCORS: true, // Fix cross-origin issues for images
          scrollX: 0, scrollY: 0,  // Avoid scroll offsets
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      // html2pdf().set(options).from(input).save();
      html2pdf().set(options).from(input).save().then(() => {
        // Remove the class after PDF generation is complete
        spans.forEach((text) => {
          text.classList.remove('pdf-span'); // Remove the class
        });
        setIsclick(false);
      }).catch((error: any) => {
        console.error("Error generating PDF:", error);
        // Optionally, remove the class even if there's an error
        spans.forEach((text) => {
          text.classList.remove('pdf-span'); // Remove the class
        });
        setIsclick(false);
      });
    }
  };

  return (
    <>
      <div style={{ height: 40 }}></div>
      <DownloadButton onClick={generatePDF}><FaDownload />PDF</DownloadButton>
      <button className="add-btn mx-2" onClick={() => navigate(-1)}>
        Back
      </button>
      <div>
        {/* content */}
        {reportData.length <= 0 ? "Report Empty" :
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
    </>
  );
};

export default InspectionReport;