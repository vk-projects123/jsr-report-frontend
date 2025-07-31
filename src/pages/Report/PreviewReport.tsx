import { useState, useEffect } from 'react';
import styled from 'styled-components';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import pdflogo from "../../images/pdflogo_transparent.png";
import { FaDownload } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { VIEW_REPORTS_API, SUBMIT_REPORT_API, GET_SIGNATURES_API, imgUrl } from "../../Api/api.tsx";
import moment from 'moment';
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid, ResponsiveContainer } from "recharts";
import { FiPaperclip } from 'react-icons/fi';

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
  margin-right: 20px;
  height: 100px;

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
  color:#000;
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
 font-size: 16px;
color:#000;
height:100%;
padding:16px;
  border-left: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: baseline;
  text-align: text-start;
  flex-direction: column; 
`;

const Table = styled.table`
color:#000;
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const TableCell = styled.td`
color:#000;
 font-size: 16px;
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
 font-size: 16px;
  background: #D8D8D8;
  color:#000;
  font-weight: bold;
  max-width: 50%; /* Set maximum width to 50% */
  overflow: hidden; /* Hide overflow content */
  text-overflow: ellipsis; /* Add ellipsis for overflow text */
  white-space: nowrap; /* Prevent text from wrapping */
`;

const Title = styled.p`
  margin: 0;
  font-size: 15px;
  color:'#000';
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
  var selectedSection: any;

  try {
    reporttype = Datas.reporttype;
    submissionID = Datas.submissionID;
    formId = Datas.formId;
    selectedSection = Datas.selectedSection;
  } catch (e) {
    reporttype = "IPQC";
    submissionID = 0;
    formId = 1;
    selectedSection = { section: 'Report Details', section_id: 1, section_type: 'inputField' };
  }

  function parseAndFormatDate(dateStr: any) {
    const [day, month, year] = dateStr.trim().split("-");
    return moment(`${year}-${month}-${day}`, "YYYY-MM-DD").format("DD-MM-YYYY");
  }

  const handleBackButton = () => {
    console.log("back button pressed!");
    navigate('/reports/running_report/1', { state: { formId: formId, reporttype: reporttype, submissionID: submissionID, selectedSection: selectedSection } });
  };

  var utoken = localStorage.getItem('workspaceuserToken');
  const [isLoaded, setLoaded] = useState<any>(false);
  var [reportData, setReportdata] = useState<any>([]);
  var [lastsection, setLastsection] = useState<any>({});
  var [signData, setSignData] = useState([]);

  useEffect(() => {
    console.log("reportData", reportData);
    setLoaded(true);
    listsectiondatas();
    getsignatures();
  }, [data]);

  const Header = ({ reportData, isClick }: any) => {
    console.log("reportData, isClick", reportData, isClick);
    return (
      !reportData ? <></> :
        <HeaderRow
          id="pdfheader"
          className="pdf-header"
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            height: "80px"
          }}
        >
          <LogoContainer
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "80px"
            }}
          >
            <img src={pdflogo} alt="PDF Logo" style={{ width: '180px', height: "80px" }} />
          </LogoContainer>

          <TitleContainer
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              height: "80px"
            }}
          >
            <strong className={isClick ? "pdf-span" : ""}>
              {reporttype == "IPQC" ? "In Process Inspection Daily Report" : reporttype == "BOM" ? "In Process Raw Material Verification" : "Pre Dispatch Inspection Report"}
            </strong>
          </TitleContainer>

          <ReportDetails
            style={{
              flex: 1,
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              height: "80px",
              flexDirection: "column", // Ensures proper stacking of text
            }}
          >
            <div className={isClick ? "pdf-span" : ""}>
              Report Date:{" "}
              {formatDateSafely(
                reportData[0].value.find((item) => item.param_name === "Date")?.value
              )}
            </div>
            <div>
              Report No:{" "}
              {lastsection ? lastsection.report_no : reportData[0].value.find((item) => item.param_name === "Report No")
                ?.value}
            </div>
          </ReportDetails>
        </HeaderRow>
    );
  };

  const Footer = ({ reportData, isClick }: any) => {
    return (
      !reportData ? <></> :
        <div id="pdffooter" style={{ width: '100%' }}>
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
        </div>
    );
  };

  const ReportDetailsSection = ({ reportData, isClick }: any) => {
    return (
      <div className="content" id="ReportDetailsSection">
        <p className={isClick ? "pdf-span " : ""} style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }}>Report Details –</p>
        <Table>
          <tbody>
            {reportData[0].value.map((item: any, index: any) => {
              // Skip "Shift" as it's being merged with "Date"
              if (item.param_name === "Shift") return null;
              if (item.param_name === "End Date") return null;


              // Find the "Shift" value
              const shiftItem = reportData[0].value.find((i: any) => i.param_name === "Shift");
              const EnddateItem = reportData[0].value.find((i: any) => i.param_name === "End Date");

              // Check if the index is even to start a new row
              if (index % 2 === 0) {
                return (
                  <tr key={index}>
                    {/* Special case for Date - Merge with Shift */}
                    {item.param_name === "Date" ? (
                      <>
                        <HeaderCell style={{ width: '25%' }}>
                          <span>Date / Shift</span>
                        </HeaderCell>
                        <TableCell style={{ width: '25%' }}>
                          <span>{formatDateSafely(item.value)} / {shiftItem ? shiftItem.value : ''}</span>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <HeaderCell style={{ width: '25%' }}>
                          <span>{item.param_name}</span>
                        </HeaderCell>
                        <TableCell style={{ width: '25%' }}>
                          <span>{item.value}</span>
                        </TableCell>
                      </>
                    )}

                    {/* Check for next item and ensure it's not "Shift" or "Report No" */}
                    {reportData[0].value[index + 1] && reportData[0].value[index + 1].param_name !== "Shift" && reportData[0].value[index + 1].param_name !== "Report No" && (
                      <>
                        <HeaderCell style={{ width: '25%' }}>
                          <span>{reportData[0].value[index + 1].param_name}</span>
                        </HeaderCell>
                        <TableCell style={{ width: '25%' }}>
                          <span>{reportData[0].value[index + 1].param_name === "Date" ? formatDateSafely(reportData[0].value[index + 1].value) + (EnddateItem.details_id != 0 ? " to " : "") + (EnddateItem.details_id != 0 ? formatDateSafely(EnddateItem.value) : '') : reportData[0].value[index + 1].value}</span>
                        </TableCell>
                      </>
                    )}
                  </tr>
                );
              }
              return null;
            })}

          </tbody>
        </Table>
      </div>
    );
  };

  const ProductStageWise = ({ reportData, isClick }: any) => {
    return (
      <div className="content" id="ProductStageWise">
        <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', color: '#000' }}>Production Stage Wise -</p>
        <Table>
          <tbody style={{ margin: 0, padding: 0 }}>
            {reportData[1].value.map((item: any, index: any) => (
              <tr key={index}>
                <HeaderCell style={{ width: "50%" }}><span>{item.param_name}</span></HeaderCell>
                <TableCell><span>{item.value}</span></TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const InspectionDetails = ({ reportData, isClick }: any) => {
    return (
      <div className="content" id="ProductStageWise">
        <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', color: '#000' }}>Inspection Details -</p>
        <Table>
          <tbody style={{ margin: 0, padding: 0 }}>
            {reportData[1].value.map((item: any, index: any) => (
              <tr key={index}>
                <HeaderCell style={{ width: "50%" }}><span>{item.param_name}</span></HeaderCell>
                <TableCell><span>{item.value}</span></TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const InspectionResults = ({ reportData, isClick }: any) => {
    return (
      <div className="content" id="InspectionResults">
        <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', color: '#000' }}>Inspection Results -</p>
        <Table>
          <tbody style={{ margin: 0, padding: 0 }}>
            {reportData[3].value.map((item: any, index: any) => (
              <tr key={index}>
                <HeaderCell style={{ width: "50%" }}><span>{item.param_name}</span></HeaderCell>
                {index == 1 ? <TableCell><span><a href={item.value ? (imgUrl + item.value) : ""} target="_blank" rel="noopener noreferrer" >{item.value ? <FiPaperclip style={{ marginRight: '5px' }} /> : "-"}</a></span></TableCell> : <TableCell><span>{item.value}</span></TableCell>}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const Attachment = ({ reportData, isClick }: any) => {
    return (
      <div className="content" id="Attachment">
        <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', color: '#000' }}>Attachment -</p>
        <Table>
          <tbody style={{ margin: 0, padding: 0 }}>
            {reportData[4].value.map((item: any, index: any) => (
              <tr key={index}>
                <HeaderCell style={{ width: "50%" }}><span>{item.param_name}</span></HeaderCell>
                {<TableCell><a href={item.value ? (imgUrl + item.value) : ""} target="_blank" rel="noopener noreferrer" >{item.value ? <FiPaperclip style={{ marginRight: '5px' }} /> : "-"}</a></TableCell>}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const MajorObservations = ({ reportData, isClick, value1, value2 }: any) => {
    return (
      reportData[2].value.slice(value1, value2).length <= 0 ? "" :
        <div className="content" id={"MajorObservations" + value2}>
          {value1 == 0 ? <Title className={isClick ? "pdf-span" : ""} style={{ color: '#000' }}>Major Observations of the Day –</Title> : ""}
          <Table>
            <tbody className="srno" style={{ margin: 0, padding: 0 }}>
              <tr style={{ margin: 0, padding: 0 }}>
                <HeaderCell style={{ textAlign: 'center', width: '5%' }}>
                  <span>Sr No</span>
                </HeaderCell>
                <HeaderCell colSpan={2}>
                  <span>Observations / Deficiency Details</span>
                </HeaderCell>
              </tr>
              {reportData[2].value.slice(value1, value2).map((observation: any, index: any) => (
                <>
                  {/* Row for Observation Text */}
                  <tr className="avoid-break">
                    <TableCell style={{ textAlign: 'center' }} rowSpan={Math.ceil(observation.images.length / 2) + 1}>
                      <span>{index + (value1 + 1)}</span> {/* Adjust index to match the skipped first item */}
                    </TableCell>
                    {observation.observations_text ? (
                      <TableCell colSpan={2}>
                        <span>{observation.observations_text}</span>
                      </TableCell>
                    ) : (
                      ""
                    )}
                  </tr>

                  {/* Rows for Images */}
                  {observation.images
                    .reduce((rows: any[], image: any, idx: number) => {
                      if (idx % 2 === 0) rows.push([]);
                      rows[rows.length - 1].push(image);
                      return rows;
                    }, [])
                    .map((rowImages: any[], rowIndex: number) => (
                      <tr key={rowIndex} id="avoid-break">
                        {rowImages.map((image: any, imgIdx: number) => (
                          <TableCell
                            key={imgIdx}
                            style={{
                              textAlign: "center",
                              width: rowImages.length % 2 === 0 ? "45%" : "93%",
                            }}
                          >
                            <img
                              src={`${imgUrl}${image.image}`}
                              alt="PDF Sub"
                              style={{
                                padding: 5,
                                maxHeight: 250,
                                objectFit: 'contain',
                                width: rowImages.length % 2 === 0 ? "100%" : "45%",
                              }}
                            />
                          </TableCell>
                        ))}
                        {/* Fill empty cell if only one image in row */}
                        {rowImages.length === 1 && ""}
                      </tr>
                    ))}
                </>
              ))}

            </tbody>
          </Table>
        </div>
    );
  };

  const InpectionObservations = ({ reportData, isClick, value1, value2 }: any) => {
    return (
      reportData[2].value.slice(value1, value2).length <= 0 ? "" :
        <div className="content" id={"MajorObservations" + value2}>
          {value1 == 0 ? <Title className={isClick ? "pdf-span" : ""} style={{ color: '#000' }}>Inpection Observations –</Title> : ""}
          <Table>
            <tbody className="srno" style={{ margin: 0, padding: 0 }}>
              <tr style={{ margin: 0, padding: 0 }}>
                <HeaderCell style={{ textAlign: 'center', width: '5%' }}>
                  <span>Sr No</span>
                </HeaderCell>
                <HeaderCell style={{ textAlign: 'center', width: '5%' }}>
                  <span>Inspection</span>
                </HeaderCell>
                <HeaderCell style={{ width: 300 }}>
                  <span>Observations / Deficiency Details</span>
                </HeaderCell>
                <HeaderCell style={{ textAlign: 'center' }} colSpan={2}>
                  <span>Image attachment</span>
                </HeaderCell>
              </tr>
              {reportData[2].value.slice(value1, value2).map((observation: any, index: any) => {
                const imageRows = observation.images.reduce((rows: any[], image: any, idx: number) => {
                  if (idx % 2 === 0) rows.push([]);
                  rows[rows.length - 1].push(image);
                  return rows;
                }, []);
                const totalImageRows = imageRows.length || 1;

                return (
                  <>
                    <tr className="avoid-break">
                      <TableCell rowSpan={totalImageRows + 1} style={{ textAlign: "center" }}>
                        <span>{index + (value1 + 1)}</span>
                      </TableCell>
                      <TableCell rowSpan={totalImageRows + 1} style={{ textAlign: "center", fontWeight: 'bold' }}>
                        <span>{observation.Inspection}</span>
                      </TableCell>
                      <TableCell rowSpan={totalImageRows + 1} style={{ width: '30%' }}>
                        <span>{observation.observations_text}</span>
                      </TableCell>
                      {/* First image row or "No image attached" */}
                      {observation.images.length === 0 ? (
                        <TableCell colSpan={2} style={{ textAlign: "center", fontStyle: "italic", color: "#888" }}>
                          <span>No image attached</span>
                        </TableCell>
                      ) : (
                        <>
                          {imageRows[0].map((image: any, imgIdx: number) => (
                            <TableCell key={imgIdx} style={{ textAlign: "center", width: 300 }}>
                              <img
                                src={`${imgUrl}${image.image}`}
                                alt="PDF Sub"
                                style={{
                                  padding: 5,
                                  maxHeight: 250,
                                  width: 300,
                                  display: "block",
                                  margin: "0 auto",
                                  objectFit: 'contain'
                                }}
                              />
                            </TableCell>
                          ))}
                        </>
                      )}
                    </tr>

                    {/* Additional image rows (if more than 2 images) */}
                    {imageRows.slice(1).map((rowImages: any[], rowIndex: number) => (
                      <tr key={`img-row-${index}-${rowIndex}`} className="avoid-break">
                        {rowImages.map((image: any, imgIdx: number) => (
                          <TableCell key={imgIdx} style={{ textAlign: "center", width: 300 }}>
                            <img
                              src={`${imgUrl}${image.image}`}
                              alt="PDF Sub"
                              style={{
                                padding: 5,
                                maxHeight: 250,
                                width: 300,
                                display: "block",
                                margin: "0 auto",
                                objectFit: 'contain'
                              }}
                            />
                          </TableCell>
                        ))}
                      </tr>
                    ))}
                  </>
                );
              })}


            </tbody>
          </Table>
        </div>
    );
  };

  const FilmCutting = ({ reportData, isClick }: any) => {
    return (
      <div className="content" id="FilmCutting">
        <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', fontSize: 18, color: '#000' }}>In Process Inspection Report –</p>
        <br />
        <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', color: '#000', fontSize: 16 }}>Process – Film Cutting</p>
        <Table>
          <tbody style={{ margin: 0, padding: 0 }}>
            <tr>
              <HeaderCell><span>Parameters</span></HeaderCell>
              {/* Dynamically render round columns based on data */}
              {Object.keys(reportData[3].value[0].value).map((round, index) => {
                // Check if any row has data for this round
                const hasData = reportData[3].value.some(item => item.value[round] !== "");
                if (hasData) {
                  return (
                    <TableCell style={{ background: "#D8D8D8", fontWeight: 'bold' }} key={index}><span>{`Round ${index + 1}`}</span></TableCell>
                  );
                }
                return null; // Skip rendering if no data for this round
              })}
            </tr>
            {reportData[3].value.map((item, index) => (
              <tr key={index}>
                <HeaderCell style={{ width: '40%' }}><span>{item.param_name}</span></HeaderCell>
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
    );
  };

  const FilmCuttingobservations = ({ reportData, isClick }: any) => {
    return (
      reportData[3].observations.length <= 0 ? "" :
        <div className="content" id="FilmCuttingobservations">
          <Table>
            <tbody className="srno" style={{ margin: 0, padding: 0 }}>
              <tr style={{ margin: 0, padding: 0 }}>
                <HeaderCell style={{ textAlign: 'center', width: '5%' }}>
                  <span>Sr No</span>
                </HeaderCell>
                <HeaderCell colSpan={2}>
                  <span>Observations / Deficiency Details</span>
                </HeaderCell>
              </tr>

              {reportData[3].observations.map((observation: any, index: any) => (
                <>
                  {/* Row for Observation Text */}
                  <tr className="content">
                    <TableCell style={{ textAlign: 'center' }} rowSpan={Math.ceil(observation.images.length / 2) + 1}>
                      <span>{index + 1}</span>
                    </TableCell>
                    {observation.observations_text ? <TableCell colSpan={2}>
                      <span>{observation.observations_text}</span>
                    </TableCell> : ""}
                  </tr>

                  {/* Rows for Images */}
                  {observation.images.reduce((rows: any[], image: any, idx: number) => {
                    if (idx % 2 === 0) rows.push([]);
                    rows[rows.length - 1].push(image);
                    return rows;
                  }, []).map((rowImages: any[], rowIndex: number) => (
                    <tr key={rowIndex}>
                      {rowImages.map((image: any, imgIdx: number) => (
                        <TableCell key={imgIdx} style={{ textAlign: 'center', width: rowImages.length % 2 === 0 ? "45%" : "93%" }}>
                          <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{
                            padding: 5,
                            maxHeight: 250,
                            objectFit: 'contain',
                            width: rowImages.length % 2 === 0 ? '100%' : "45%"
                          }} />
                        </TableCell>
                      ))}
                      {/* Fill empty cell if only one image in row */}
                      {rowImages.length === 1 && ""}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </Table>
        </div>
    );
  };

  const TabberAndStringer = ({ reportData, isClick }: any) => {
    return (
      <div className="content">
        <div className="content" id="TabberAndStringer">
          <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', color: '#000' }}>Process – Tabber & Stringer</p>
          <Table>
            <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
              <tr>
                <th style={{ background: "#D8D8D8", border: '1px solid black', padding: '5px' }}><span>Parameters</span></th>
                {/* Dynamically render round columns based on data */}
                {Object.keys(reportData[4].value[0].value).map((round, index) => {
                  // Check if any row has data for this round
                  const hasData = reportData[4].value.some(item => item.value[round] !== "");
                  if (hasData) {
                    return (
                      <th key={index} style={{ background: "#D8D8D8", border: '1px solid black', padding: '5px' }}>
                        <span>{`Round ${index + 1}`}</span>
                      </th>
                    );
                  }
                  return null; // Skip rendering if no data for this round
                })}
              </tr>
              {reportData[4].value.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td style={{ width: '40%', background: "#D8D8D8", border: '1px solid black', padding: '5px', fontWeight: 'bold' }}><span>{row.param_name}</span></td>
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
    );
  };

  const TabberAndStringerObservations = ({ reportData, isClick }: any) => {
    return (
      reportData[4].observations.length <= 0 ? "" :
        <div className="content" id="TabberAndStringerObservations">
          <Table>
            <tbody className="srno" style={{ margin: 0, padding: 0 }}>
              <tr style={{ margin: 0, padding: 0 }}>
                <HeaderCell style={{ textAlign: 'center', width: '5%' }}>
                  <span>Sr No</span>
                </HeaderCell>
                <HeaderCell colSpan={2}>
                  <span>Observations / Deficiency Details</span>
                </HeaderCell>
              </tr>

              {reportData[4].observations.map((observation: any, index: any) => (
                <>
                  {/* Row for Observation Text */}
                  <tr>
                    <TableCell style={{ textAlign: 'center' }} rowSpan={Math.ceil(observation.images.length / 2) + 1}>
                      <span>{index + 1}</span>
                    </TableCell>
                    {observation.observations_text ? <TableCell colSpan={2}>
                      <span>{observation.observations_text}</span>
                    </TableCell> : ""}
                  </tr>

                  {/* Rows for Images */}
                  {observation.images.reduce((rows: any[], image: any, idx: number) => {
                    if (idx % 2 === 0) rows.push([]);
                    rows[rows.length - 1].push(image);
                    return rows;
                  }, []).map((rowImages: any[], rowIndex: number) => (
                    <tr key={rowIndex}>
                      {rowImages.map((image: any, imgIdx: number) => (
                        <TableCell key={imgIdx} style={{
                          textAlign: 'center',
                          width: rowImages.length % 2 === 0 ? "45%" : "93%"
                        }}>
                          <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{
                            padding: 5,
                            maxHeight: 250,
                            objectFit: 'contain',
                            width: rowImages.length % 2 === 0 ? '100%' : "45%"
                          }} />
                        </TableCell>
                      ))}
                      {/* Fill empty cell if only one image in row */}
                      {rowImages.length === 1 && ""}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </Table>
        </div>
    );
  };

  const Layup = ({ reportData, isClick }: any) => {
    return (
      <div className="content" id="Layup">
        <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', color: '#000' }}>Process – Layup</p>
        <Table>
          <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
            <tr>
              <th style={{ background: "#D8D8D8", border: '1px solid black', padding: '5px' }}><span>Parameters</span></th>
              {/* Dynamically render round columns based on data */}
              {Object.keys(reportData[5].value[0].value).map((round, index) => {
                // Check if any row has data for this round
                const hasData = reportData[5].value.some(item => item.value[round] !== "");
                if (hasData) {
                  return (
                    <th key={index} style={{ background: "#D8D8D8", border: '1px solid black', padding: '5px' }}>
                      <span>{`Round ${index + 1}`}</span>
                    </th>
                  );
                }
                return null; // Skip rendering if no data for this round
              })}
            </tr>
            {reportData[5].value.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td style={{ fontWeight: 'bold', width: '40%', background: "#D8D8D8", border: '1px solid black', padding: '5px' }}><span>{row.param_name}</span></td>
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
    );
  };

  const LayupObservations = ({ reportData, isClick }: any) => {
    return (
      reportData[5].observations.length <= 0 ? "" :
        <div className="content" id="LayupObservations">
          <Table>
            <tbody className="srno" style={{ margin: 0, padding: 0 }}>
              <tr style={{ margin: 0, padding: 0 }}>
                <HeaderCell style={{ textAlign: 'center', width: '5%' }}>
                  <span>Sr No</span>
                </HeaderCell>
                <HeaderCell colSpan={2}>
                  <span>Observations / Deficiency Details</span>
                </HeaderCell>
              </tr>

              {reportData[5].observations.map((observation: any, index: any) => (
                <>
                  {/* Row for Observation Text */}
                  <tr>
                    <TableCell style={{ textAlign: 'center' }} rowSpan={Math.ceil(observation.images.length / 2) + 1}>
                      <span>{index + 1}</span>
                    </TableCell>
                    {observation.observations_text ? <TableCell colSpan={2}>
                      <span>{observation.observations_text}</span>
                    </TableCell> : ""}
                  </tr>

                  {/* Rows for Images */}
                  {observation.images.reduce((rows: any[], image: any, idx: number) => {
                    if (idx % 2 === 0) rows.push([]);
                    rows[rows.length - 1].push(image);
                    return rows;
                  }, []).map((rowImages: any[], rowIndex: number) => (
                    <tr key={rowIndex}>
                      {rowImages.map((image: any, imgIdx: number) => (
                        <TableCell key={imgIdx} style={{ textAlign: 'center', width: rowImages.length % 2 === 0 ? "45%" : "93%" }}>
                          <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{
                            padding: 5,
                            //  height: 250, 
                            objectFit: 'contain',
                            width: rowImages.length % 2 === 0 ? '100%' : "45%"
                          }} />
                        </TableCell>
                      ))}
                      {/* Fill empty cell if only one image in row */}
                      {rowImages.length === 1 && ""}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </Table>
        </div>
    );
  };

  const Lamination = ({ reportData, isClick }: any) => {
    return (
      <div className="content" id="Lamination">
        <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', color: '#000' }}>Process – Lamination</p>
        <Table>
          <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
            <tr>
              <th style={{ background: "#D8D8D8", border: '1px solid black', padding: '5px' }}><span>Parameters</span></th>
              {/* Dynamically render round columns based on data */}
              {Object.keys(reportData[6].value[0].value).map((round, index) => {
                // Check if any row has data for this round
                const hasData = reportData[6].value.some(item => item.value[round] !== "");
                if (hasData) {
                  return (
                    <th key={index} style={{ background: "#D8D8D8", border: '1px solid black', padding: '5px' }}>
                      <span>{`Round ${index + 1}`}</span>
                    </th>
                  );
                }
                return null; // Skip rendering if no data for this round
              })}
            </tr>
            {reportData[6].value.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td style={{ fontWeight: 'bold', width: '40%', background: "#D8D8D8", border: '1px solid black', padding: '5px' }}><span>{row.param_name}</span></td>
                {Object.keys(row.value).map((round, index) => {
                  // Check if this round has data
                  if (row.value[round] !== "") {
                    return (
                      <td key={index} style={{ border: '1px solid black', padding: '5px' }}>
                        <span>{row.inputType == 'date' ? formatDateSafely(row.value[round]) : row.value[round]}</span>
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
    );
  };

  const LaminationObservations = ({ reportData, isClick }: any) => {
    return (
      reportData[6].observations.length <= 0 ? "" :
        <div className="content" id="LaminationObservations">
          <Table>
            <tbody className="srno" style={{ margin: 0, padding: 0 }}>
              <tr style={{ margin: 0, padding: 0 }}>
                <HeaderCell style={{ textAlign: 'center', width: '5%' }}>
                  <span>Sr No</span>
                </HeaderCell>
                <HeaderCell colSpan={2}>
                  <span>Observations / Deficiency Details</span>
                </HeaderCell>
              </tr>

              {reportData[6].observations.map((observation: any, index: any) => (
                <>
                  {/* Row for Observation Text */}
                  <tr>
                    <TableCell style={{ textAlign: 'center' }} rowSpan={Math.ceil(observation.images.length / 2) + 1}>
                      <span>{index + 1}</span>
                    </TableCell>
                    {observation.observations_text ? <TableCell colSpan={2}>
                      <span>{observation.observations_text}</span>
                    </TableCell> : ""}
                  </tr>

                  {/* Rows for Images */}
                  {observation.images.reduce((rows: any[], image: any, idx: number) => {
                    if (idx % 2 === 0) rows.push([]);
                    rows[rows.length - 1].push(image);
                    return rows;
                  }, []).map((rowImages: any[], rowIndex: number) => (
                    <tr key={rowIndex}>
                      {rowImages.map((image: any, imgIdx: number) => (
                        <TableCell key={imgIdx} style={{ textAlign: 'center', width: rowImages.length % 2 === 0 ? "45%" : "90%" }}>
                          <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{
                            padding: 5,
                            maxHeight: 250,
                            objectFit: 'contain',
                            width: rowImages.length % 2 === 0 ? '100%' : "45%"
                          }} />
                        </TableCell>
                      ))}
                      {/* Fill empty cell if only one image in row */}
                      {rowImages.length === 1 && ""}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </Table>
        </div>
    );
  };

  const Framing = ({ reportData, isClick }: any) => {
    return (
      <div className="content" id="Framing">
        <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', color: '#000' }}>Process – Framing</p>
        <Table>
          <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
            <tr>
              <th style={{ background: "#D8D8D8", border: '1px solid black', padding: '5px' }}><span>Parameters</span></th>
              {/* Dynamically render round columns based on data */}
              {Object.keys(reportData[7].value[0].value).map((round, index) => {
                // Check if any row has data for this round
                const hasData = reportData[7].value.some(item => item.value[round] !== "");
                if (hasData) {
                  return (
                    <th key={index} style={{ background: "#D8D8D8", border: '1px solid black', padding: '5px' }}>
                      <span>{`Round ${index + 1}`}</span>
                    </th>
                  );
                }
                return null; // Skip rendering if no data for this round
              })}
            </tr>
            {reportData[7].value.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td style={{ fontWeight: 'bold', width: '40%', background: "#D8D8D8", border: '1px solid black', padding: '5px' }}><span>{row.param_name}</span></td>
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
    );
  };

  const FramingObservation = ({ reportData, isClick }: any) => {
    return (
      reportData[7].observations.length <= 0 ? "" :
        <div className="content" id="FramingObservation">
          <Table>
            <tbody className="srno" style={{ margin: 0, padding: 0 }}>
              <tr style={{ margin: 0, padding: 0 }}>
                <HeaderCell style={{ textAlign: 'center', width: '5%' }}>
                  <span>Sr No</span>
                </HeaderCell>
                <HeaderCell colSpan={2}>
                  <span>Observations / Deficiency Details</span>
                </HeaderCell>
              </tr>

              {reportData[7].observations.map((observation: any, index: any) => (
                <>
                  {/* Row for Observation Text */}
                  <tr>
                    <TableCell style={{ textAlign: 'center' }} rowSpan={Math.ceil(observation.images.length / 2) + 1}>
                      <span>{index + 1}</span>
                    </TableCell>
                    {observation.observations_text ? <TableCell colSpan={2}>
                      <span>{observation.observations_text}</span>
                    </TableCell> : ""}
                  </tr>

                  {/* Rows for Images */}
                  {observation.images.reduce((rows: any[], image: any, idx: number) => {
                    if (idx % 2 === 0) rows.push([]);
                    rows[rows.length - 1].push(image);
                    return rows;
                  }, []).map((rowImages: any[], rowIndex: number) => (
                    <tr key={rowIndex}>
                      {rowImages.map((image: any, imgIdx: number) => (
                        <TableCell key={imgIdx} style={{ textAlign: 'center', width: rowImages.length % 2 === 0 ? "45%" : "93%" }}>
                          <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{
                            padding: 5,
                            //  height: 250, 
                            objectFit: 'contain',
                            width: rowImages.length % 2 === 0 ? '100%' : "45%"
                          }} />
                        </TableCell>
                      ))}
                      {/* Fill empty cell if only one image in row */}
                      {rowImages.length === 1 && ""}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </Table>
        </div>
    );
  };

  const Observations = ({ value, reportData, index, isClick }: any) => {
    console.log("get section name ->>", value);
    return (
      <div className="content" id={value}>
        <Table>
          <tbody className="srno" style={{ margin: 0, padding: 0 }}>
            <tr style={{ margin: 0, padding: 0 }}>
              <HeaderCell style={{ textAlign: 'center', width: '5%' }}>
                <span>Sr No</span>
              </HeaderCell>
              <HeaderCell colSpan={2}>
                <span>Observations / Deficiency Details</span>
              </HeaderCell>
            </tr>

            <>
              {/* Row for Observation Text */}
              <tr>
                <TableCell style={{ textAlign: 'center' }} rowSpan={Math.ceil(reportData.images.length / 2) + 1}>
                  <span>{index + 1}</span>
                </TableCell>
                {reportData.observations_text ? <TableCell colSpan={2}>
                  <span>{reportData.observations_text}</span>
                </TableCell> : ""}
              </tr>

              {/* Rows for Images */}
              {reportData.images.reduce((rows: any[], image: any, idx: number) => {
                if (idx % 2 === 0) rows.push([]);
                rows[rows.length - 1].push(image);
                return rows;
              }, []).map((rowImages: any[], rowIndex: number) => (
                <tr key={rowIndex}>
                  {rowImages.map((image: any, imgIdx: number) => (
                    <TableCell key={imgIdx} style={{ textAlign: 'center', width: rowImages.length % 2 === 0 ? "45%" : "93%" }}>
                      <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{
                        padding: 5,
                        //  height: 250, 
                        objectFit: 'contain',
                        width: rowImages.length % 2 === 0 ? '100%' : "45%"
                      }} />
                    </TableCell>
                  ))}
                  {/* Fill empty cell if only one image in row */}
                  {rowImages.length === 1 && ""}
                </tr>
              ))}
            </>
          </tbody>
        </Table>
      </div>
    );
  };

  const FlasherTesting = ({ reportData, isClick }: any) => {
    return (
      <div className="content" id="FlasherTesting">
        <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', color: '#000' }}>Process – Flasher Testing</p>
        <Table>
          <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
            <tr>
              <th style={{ background: "#D8D8D8", border: '1px solid black', padding: '5px' }}><span>Parameters</span></th>
              {/* Dynamically render round columns based on data */}
              {Object.keys(reportData[8].value[0].value).map((round, index) => {
                // Check if any row has data for this round
                const hasData = reportData[8].value.some(item => item.value[round] !== "");
                if (hasData) {
                  return (
                    <th key={index} style={{ background: "#D8D8D8", border: '1px solid black', padding: '5px' }}>
                      <span>{`Round ${index + 1}`}</span>
                    </th>
                  );
                }
                return null; // Skip rendering if no data for this round
              })}
            </tr>
            {reportData[8].value.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td style={{ fontWeight: 'bold', width: '40%', background: "#D8D8D8", border: '1px solid black', padding: '5px' }}><span>{row.param_name}</span></td>
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
    );
  };

  const FlasherTestingObservations = ({ reportData, isClick }: any) => {
    return (
      reportData[8].observations.length <= 0 ? "" :
        <div className="content" id="FlasherTestingObservations">
          <Table>
            <tbody className="srno" style={{ margin: 0, padding: 0 }}>
              <tr style={{ margin: 0, padding: 0 }}>
                <HeaderCell style={{ textAlign: 'center', width: '5%' }}>
                  <span>Sr No</span>
                </HeaderCell>
                <HeaderCell colSpan={2}>
                  <span>Observations / Deficiency Details</span>
                </HeaderCell>
              </tr>

              {reportData[8].observations.map((observation: any, index: any) => (
                <>
                  {/* Row for Observation Text */}
                  <tr>
                    <TableCell style={{ textAlign: 'center' }} rowSpan={Math.ceil(observation.images.length / 2) + 1}>
                      <span>{index + 1}</span>
                    </TableCell>
                    {observation.observations_text ? <TableCell colSpan={2}>
                      <span>{observation.observations_text}</span>
                    </TableCell> : ""}
                  </tr>

                  {/* Rows for Images */}
                  {observation.images.reduce((rows: any[], image: any, idx: number) => {
                    if (idx % 2 === 0) rows.push([]);
                    rows[rows.length - 1].push(image);
                    return rows;
                  }, []).map((rowImages: any[], rowIndex: number) => (
                    <tr key={rowIndex}>
                      {rowImages.map((image: any, imgIdx: number) => (
                        <TableCell key={imgIdx} style={{ textAlign: 'center', width: rowImages.length % 2 === 0 ? "45%" : "93%" }}>
                          <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{
                            padding: 5,
                            maxHeight: 250,
                            objectFit: 'contain',
                            width: rowImages.length % 2 === 0 ? '100%' : "45%"
                          }} />
                        </TableCell>
                      ))}
                      {/* Fill empty cell if only one image in row */}
                      {rowImages.length === 1 && ""}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </Table>
        </div>
    );
  };

  const RandomSampleCheck = ({ reportData, isClick }: any) => {
    return (
      <div className="content" id="RandomSampleCheck">
        <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', color: '#000' }}>Random Sample Check</p>
        <Table>
          <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
            <tr style={{ background: "#D8D8D8" }}>
              <th className="srno" style={{ border: '1px solid black', padding: '5px', width: '5%' }}><span>Sr No</span></th>
              <th style={{ border: '1px solid black', padding: '5px', fontWeight: 'bold' }}><span>Test</span></th>
              <th style={{ border: '1px solid black', padding: '5px' }}><span>Module Sr. No.</span></th>
              <th style={{ border: '1px solid black', padding: '5px' }}><span>Results</span></th>
            </tr>
            {reportData[9].value.map((item, index) => (
              <tr key={index}>
                <td className="srno" style={{ border: '1px solid black', padding: '5px' }}><span>{index + 1}</span></td>
                <td style={{ border: '1px solid black', padding: '5px', fontWeight: 'bold' }}><span>{item.test}</span></td>
                <td style={{ border: '1px solid black', padding: '5px' }}><span>{item.module_sr_no}</span></td>
                <td style={{ border: '1px solid black', padding: '5px' }}><span>{item.result}</span></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const RandomSampleCheckObservations = ({ reportData, isClick }: any) => {
    return (
      reportData[9].observations.length <= 0 ? "" :
        <div className="content" id="RandomSampleCheckObservations">
          <Table>
            <tbody className="srno" style={{ margin: 0, padding: 0 }}>
              <tr style={{ margin: 0, padding: 0 }}>
                <HeaderCell style={{ textAlign: 'center', width: '5%' }}>
                  <span>Sr No</span>
                </HeaderCell>
                <HeaderCell colSpan={2}>
                  <span>Observations / Deficiency Details</span>
                </HeaderCell>
              </tr>

              {reportData[9].observations.map((observation: any, index: any) => (
                <>
                  {/* Row for Observation Text */}
                  <tr>
                    <TableCell style={{ textAlign: 'center' }} rowSpan={Math.ceil(observation.images.length / 2) + 1}>
                      <span>{index + 1}</span>
                    </TableCell>
                    {observation.observations_text ? <TableCell colSpan={2}>
                      <span>{observation.observations_text}</span>
                    </TableCell> : ""}
                  </tr>

                  {/* Rows for Images */}
                  {observation.images.reduce((rows: any[], image: any, idx: number) => {
                    if (idx % 2 === 0) rows.push([]);
                    rows[rows.length - 1].push(image);
                    return rows;
                  }, []).map((rowImages: any[], rowIndex: number) => (
                    <tr key={rowIndex}>
                      {rowImages.map((image: any, imgIdx: number) => (
                        <TableCell key={imgIdx} style={{ textAlign: 'center', width: rowImages.length % 2 === 0 ? "45%" : "93%" }}>
                          <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{
                            padding: 5,
                            maxHeight: 250,
                            objectFit: 'contain',
                            width: rowImages.length % 2 === 0 ? '100%' : "45%"
                          }} />
                        </TableCell>
                      ))}
                      {/* Fill empty cell if only one image in row */}
                      {rowImages.length === 1 && ""}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </Table>
        </div>
    );
  };

  const BomTableData = ({ reportData, id, value1, value2, isClick }: any) => {
    return (
      reportData.length <= 0 ? "" :
        <div className="content" id={id}>
          <Table>
            <tbody style={{ margin: 0, padding: 0 }}>
              {/* Header Row */}
              <tr>
                <HeaderCell style={{ width: '80px' }}><span>Sr. No.</span></HeaderCell>
                <HeaderCell style={{ width: '150px' }}><span>Component</span></HeaderCell>
                <HeaderCell style={{ width: '300px' }}><span>Description as per BOM</span></HeaderCell>
                <HeaderCell><span>Verification Results</span></HeaderCell>
              </tr>


              {reportData.slice(value1, value2).map((section, sectionIndex) => (
                <>
                  {section.value.map((param, paramIndex) => (
                    <tr key={`${section.section_id}-${param.param_id}`}>
                      {paramIndex === 0 && (
                        <>
                          <TableCell style={{ textAlign: 'center' }} rowSpan={section.value.length}>
                            <span>{sectionIndex + (value1)}</span>
                          </TableCell>
                          <TableCell rowSpan={section.value.length}>
                            <span>{section.section_name}</span>
                          </TableCell>
                        </>
                      )}
                      <TableCell>
                        <span>{param.param_name}</span>
                      </TableCell>
                      <TableCell>
                        <span>{param.value}</span>
                      </TableCell>
                    </tr>
                  ))}
                </>
              ))}

            </tbody>
          </Table>
        </div>
    );
  };

  const SignatureSection = ({ signData, isClick }: any) => {
    return (
      <>
        {signData.map((datas: any, findex: any) => (
          <div className="content" id={"Signature" + (findex + 1)}>
            {datas.data.length == 0 ? "" :
              <div key={findex}>
                <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', color: '#000' }}>
                  {datas.sign_role} Signature -
                </p>
                <Table>
                  <tbody>
                    <tr>
                      {datas.data.map((item: any, index: number) => (
                        <TableCell key={index} style={{ verticalAlign: 'top', padding: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <p><strong>Name:</strong> {item.sign_username}</p>
                              <p><strong>Date & Time:</strong> {moment(item.created_at).format("DD/MM/YYYY hh:mm A")}</p>
                              <p><strong>Signature:</strong></p>
                              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                <img
                                  src={`${imgUrl}${item.sign}`}
                                  alt="Signature"
                                  style={{ width: '150px', height: 'auto' }}
                                />
                              </div>
                            </div>
                            {!isClick && (
                              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                <img
                                  src={`${imgUrl}${item.sign_selfie}`}
                                  alt="Selfie"
                                  style={{ width: '150px', height: 'auto' }}
                                />
                              </div>
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </tr>
                  </tbody>
                </Table>
              </div>
            }
          </div>
        ))}
      </>
    );
  };

  // Function to fetch sections
  const listsectiondatas = async () => {

    console.log("data ->>", {
      form_id: formId,
      report_type: reporttype,
      submission_id: submissionID
    });

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
        //console.log(data.info);
        setReportdata(data.info || []);
        setLastsection(data.submission[0]);
        setLoaded(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setLoaded(false);
    }
  };

  const [isClick, setIsclick] = useState(false);

  // const generatePDF = async () => {
  //   setIsclick(true);

  //   await new Promise((resolve) => setTimeout(resolve, 1000)); // Allow DOM updates

  //   const input = document.getElementById("report");
  //   const header = document.getElementById("pdfheader");
  //   const footer = document.getElementById("pdffooter");

  //   if (!input || !header || !footer) {
  //     console.error("Missing required sections for PDF generation.");
  //     setIsclick(false);
  //     return;
  //   }

  //   const sections: string[] = [];

  //   sections.push("ReportDetailsSection");
  //   sections.push("bomdetails");
  //   sections.push("bomdetails1");
  //   sections.push("ProductStageWise");
  //   console.log("reportData[2]:", reportData[2]);
  //   // Safely add MajorObservations
  //   (reportData[2]?.value || []).forEach((_, ind) =>
  //     sections.push("MajorObservations" + ind)
  //   );

  //   sections.push("FilmCutting");
  //   (reportData[3]?.observations || []).forEach((_, ind) =>
  //     sections.push("FilmCuttingobservations" + ind)
  //   );

  //   sections.push("TabberAndStringer");
  //   (reportData[4]?.observations || []).forEach((_, ind) =>
  //     sections.push("TabberAndStringerObservations" + ind)
  //   );

  //   sections.push("Layup");
  //   (reportData[5]?.observations || []).forEach((_, ind) =>
  //     sections.push("LayupObservations" + ind)
  //   );

  //   sections.push("Lamination");
  //   (reportData[6]?.observations || []).forEach((_, ind) =>
  //     sections.push("LaminationObservations" + ind)
  //   );

  //   sections.push("Framing");
  //   (reportData[7]?.observations || []).forEach((_, ind) =>
  //     sections.push("FramingObservation" + ind)
  //   );

  //   sections.push("FlasherTesting");
  //   (reportData[8]?.observations || []).forEach((_, ind) =>
  //     sections.push("FlasherTestingObservations" + ind)
  //   );

  //   sections.push("RandomSampleCheck");
  //   (reportData[9]?.observations || []).forEach((_, ind) =>
  //     sections.push("RandomSampleCheckObservations" + ind)
  //   );

  //   sections.push("InspectionResults");
  //   sections.push("Attachment");
  //   sections.push("report_completed");


  //   console.log("sections", sections);
  //   const spans = document.querySelectorAll("table span");
  //   spans.forEach((text) => text.classList.add("pdf-span"));

  //   const pdf = new jsPDF({
  //     orientation: "p",
  //     unit: "mm",
  //     format: "a4",
  //     compress: true // Enable PDF compression
  //   });

  //   const pageHeight = 297;
  //   const margin = 10;
  //   const headerHeight = 20;
  //   const footerHeight = 10;
  //   const pageNumberOffset = 10;
  //   let yOffset = margin + headerHeight + 5;
  //   let pageNumber = 1;
  //   let totalPages = 1; // Placeholder for total pages

  //   const convertToImage = async (element) => {
  //     return html2canvas(element, {
  //       scale: 1, useCORS: true, logging: false,
  //       allowTaint: true,
  //     })
  //       .then((canvas) => canvas.toDataURL("image/png", 0.8))
  //       .catch((error) => {
  //         console.error("Error capturing element:", element.id, error);
  //         return null;
  //       });
  //   };

  //   try {
  //     const headerImage = await convertToImage(header);
  //     const footerImage = await convertToImage(footer);

  //     if (!headerImage || !footerImage) {
  //       throw new Error("Header/Footer image conversion failed.");
  //     }

  //     const addFooter = (currentPage, totalPages) => {
  //       const paddingTop = 2;
  //       pdf.addImage(footerImage, "PNG", margin, pageHeight - footerHeight - margin - pageNumberOffset, 190, footerHeight + paddingTop);
  //       pdf.setFontSize(10);
  //       pdf.text(`Page No: ${currentPage} / ${totalPages}`, 160, pageHeight - margin - 5);
  //     };

  //     pdf.addImage(headerImage, "PNG", margin, margin, 190, headerHeight);

  //     let pageIndexes = [];

  //     for (const sectionId of sections) {
  //       const section = document.getElementById(sectionId);
  //       if (!section) {
  //         console.warn(`Skipping missing section: ${sectionId}`);
  //         continue;
  //       }

  //       await new Promise((resolve) => setTimeout(resolve, 500));

  //       const sectionImage = await convertToImage(section);
  //       const sectionHeight = (section.clientHeight * 210) / input.clientWidth;

  //       if (!sectionImage) {
  //         console.warn(`Skipping section due to rendering error: ${sectionId}`);
  //         continue;
  //       }

  //       if (yOffset + sectionHeight + footerHeight > pageHeight - margin) {
  //         pageIndexes.push(pageNumber);
  //         pdf.addPage();
  //         pageNumber++;
  //         yOffset = margin;

  //         pdf.addImage(headerImage, "PNG", margin, margin, 190, headerHeight);
  //         yOffset = margin + headerHeight + 5;
  //       }

  //       pdf.addImage(sectionImage, "PNG", margin, yOffset, 190, sectionHeight);
  //       yOffset += sectionHeight + 5;
  //     }

  //     totalPages = pdf.internal.getNumberOfPages(); // Get total pages

  //     // Update footers with total page count
  //     for (let i = 1; i <= totalPages; i++) {
  //       pdf.setPage(i);
  //       addFooter(i, totalPages);
  //     }

  //     pdf.save("inspection_report.pdf");
  //     spans.forEach((text) => text.classList.remove("pdf-span"));
  //   } catch (error) {
  //     console.error("PDF generation failed:", error);
  //     spans.forEach((text) => text.classList.remove("pdf-span"));
  //   }

  //   setIsclick(false);
  // };

  const generatePDF = async () => {
    setIsclick(true);

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Allow DOM updates

    const input = document.getElementById("report");
    const header = document.getElementById("pdfheader");
    const footer = document.getElementById("pdffooter");

    if (!input || !header || !footer) {
      console.error("Missing required sections for PDF generation.");
      setIsclick(false);
      return;
    }

    const sections: string[] = [];

    sections.push("ReportDetailsSection");
    sections.push("bomdetails");
    sections.push("bomdetails1");
    sections.push("ProductStageWise");

    (reportData[2]?.value || []).forEach((_, ind) =>
      sections.push("MajorObservations" + ind)
    );

    sections.push("FilmCutting");
    (reportData[3]?.observations || []).forEach((_, ind) =>
      sections.push("FilmCuttingobservations" + ind)
    );

    sections.push("TabberAndStringer");
    (reportData[4]?.observations || []).forEach((_, ind) =>
      sections.push("TabberAndStringerObservations" + ind)
    );

    sections.push("Layup");
    (reportData[5]?.observations || []).forEach((_, ind) =>
      sections.push("LayupObservations" + ind)
    );

    sections.push("Lamination");
    (reportData[6]?.observations || []).forEach((_, ind) =>
      sections.push("LaminationObservations" + ind)
    );

    sections.push("Framing");
    (reportData[7]?.observations || []).forEach((_, ind) =>
      sections.push("FramingObservation" + ind)
    );

    sections.push("FlasherTesting");
    (reportData[8]?.observations || []).forEach((_, ind) =>
      sections.push("FlasherTestingObservations" + ind)
    );

    sections.push("RandomSampleCheck");
    (reportData[9]?.observations || []).forEach((_, ind) =>
      sections.push("RandomSampleCheckObservations" + ind)
    );

    sections.push("InspectionResults");
    sections.push("Attachment");
    sections.push("report_completed");

    const spans = document.querySelectorAll("table span");
    spans.forEach((text) => text.classList.add("pdf-span"));

    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageHeight = 297;
    const margin = 10;
    const headerHeight = 20;
    const footerHeight = 10;
    const pageNumberOffset = 10;
    const usablePageHeight = pageHeight - margin - footerHeight - pageNumberOffset;

    let yOffset = margin + headerHeight + 5;
    let pageNumber = 1;

    const convertToImage = async (element) => {
      return html2canvas(element, {
        scale: 1,
        useCORS: true,
        logging: false,
        allowTaint: true,
      })
        .then((canvas) => canvas.toDataURL("image/png", 0.8))
        .catch((error) => {
          console.error("Error capturing element:", element.id, error);
          return null;
        });
    };

    try {
      const headerImage = await convertToImage(header);
      const footerImage = await convertToImage(footer);

      if (!headerImage || !footerImage) {
        throw new Error("Header/Footer image conversion failed.");
      }

      const addFooter = (currentPage, totalPages) => {
        const paddingTop = 2;
        pdf.addImage(
          footerImage,
          "PNG",
          margin,
          pageHeight - footerHeight - margin - pageNumberOffset,
          190,
          footerHeight + paddingTop
        );
        pdf.setFontSize(10);
        pdf.text(`Page No: ${currentPage} / ${totalPages}`, 160, pageHeight - margin - 5);
      };

      pdf.addImage(headerImage, "PNG", margin, margin, 190, headerHeight);

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (!section) {
          console.warn(`Skipping missing section: ${sectionId}`);
          continue;
        }

        await new Promise((resolve) => setTimeout(resolve, 500));

        const sectionImage = await convertToImage(section);
        const sectionHeight = (section.clientHeight * 210) / input.clientWidth;

        if (!sectionImage) {
          console.warn(`Skipping section due to rendering error: ${sectionId}`);
          continue;
        }

        if (yOffset + sectionHeight > usablePageHeight) {
          pdf.addPage();
          pageNumber++;
          yOffset = margin;

          pdf.addImage(headerImage, "PNG", margin, margin, 190, headerHeight);
          yOffset = margin + headerHeight + 5;
        }

        pdf.addImage(sectionImage, "PNG", margin, yOffset, 190, sectionHeight);
        yOffset += sectionHeight + 5;
      }

      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        addFooter(i, totalPages);
      }

      pdf.save("inspection_report.pdf");
      spans.forEach((text) => text.classList.remove("pdf-span"));
    } catch (error) {
      console.error("PDF generation failed:", error);
      spans.forEach((text) => text.classList.remove("pdf-span"));
    }

    setIsclick(false);
  };

  const getsignatures = async () => {

    const params = new URLSearchParams({
      submission_id: submissionID
    });

    try {
      const response = await fetch(`${GET_SIGNATURES_API}?${params.toString()}`, {
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
        //console.log(data.info);
        setSignData(data.info || []);
        setLoaded(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setLoaded(false);
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
          body: JSON.stringify({
            submission_id: submissionID,
            form_id: formId
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

  const ChartData = [
    { date: "12/25/2024", dayProduction: 120, nightProduction: 222, totalRejection: 50 },
    { date: "12/26/2024", dayProduction: 350, nightProduction: 334, totalRejection: 70 },
    { date: "12/27/2024", dayProduction: 300, nightProduction: 335, totalRejection: 50 },
    { date: "12/28/2024", dayProduction: 133, nightProduction: 145, totalRejection: 51 },
  ];

  var sections = [
    "FilmCuttingobservations",
    "TabberAndStringerObservations",
    "LayupObservations",
    "LaminationObservations",
    "FramingObservation",
    "FlasherTestingObservations",
    "RandomSampleCheckObservations"
  ];

  function formatDateSafely(inputDate: string): string {
    if (!inputDate || inputDate.trim() === "") {
      return "Not filled date";
    }

    // Try to parse with ISO first
    let date = moment(inputDate, moment.ISO_8601, true);

    // If invalid, try assuming it was mistakenly parsed as DD-MM-YYYY
    if (!date.isValid()) {
      // Try DD-MM-YYYY format just in case
      date = moment(inputDate, "DD-MM-YYYY", true);
    }

    // If still invalid, return fallback message
    if (!date.isValid()) {
      return "Not filled date";
    }

    return date.format("DD-MM-YYYY");
  }

  return (
    <>
      <div style={{ height: 40 }}></div>
      <DownloadButton onClick={generatePDF}><FaDownload /> {isClick ? (
        <svg
          className="w-5 h-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      ) : (
        'PDF'
      )}</DownloadButton>

      <button className="add-btn mx-2" onClick={handleBackButton}>
        Back
      </button>
      {submissionID != 0 ?
        <button className="add-btn mx-2" onClick={submitReport}>
          Submit Report
        </button>
        : ""}

      {reporttype === "IPQC" ?
        <div style={{
          flex: 1,
          alignItems: 'center'
        }}>
          {isClick ?
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="flex flex-col items-center">
                {/* Loader Spinner */}
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white text-lg mt-4">Generating PDF, please wait...</p>
              </div>
            </div>
            : ""}
          {/* content */}
          {reportData.length <= 0 ? "Loading ..." :
            <Container id="report" style={{ width: isClick ? 900 : "100%" }}>
              <Header reportData={reportData} isClick={isClick} />
              {/* Report Details */}
              <ReportDetailsSection reportData={reportData} isClick={isClick} />

              {/* Production Stage Wise */}
              <ProductStageWise reportData={reportData} isClick={isClick} />

              {/* Major Observations of the Day */}
              <MajorObservations reportData={reportData} isClick={isClick} value1={0} value2={1} />
              <MajorObservations reportData={reportData} isClick={isClick} value1={1} value2={2} />
              <MajorObservations reportData={reportData} isClick={isClick} value1={2} value2={3} />
              <MajorObservations reportData={reportData} isClick={isClick} value1={3} value2={4} />
              <MajorObservations reportData={reportData} isClick={isClick} value1={4} value2={5} />
              <MajorObservations reportData={reportData} isClick={isClick} value1={5} value2={6} />
              <MajorObservations reportData={reportData} isClick={isClick} value1={6} value2={7} />
              <MajorObservations reportData={reportData} isClick={isClick} value1={7} value2={8} />
              <MajorObservations reportData={reportData} isClick={isClick} value1={8} value2={9} />
              <MajorObservations reportData={reportData} isClick={isClick} value1={9} value2={10} />

              {/* Process – Film Cutting */}
              <FilmCutting reportData={reportData} isClick={isClick} />

              {/* film cutting observatios */}
              {(reportData[3].observations || []).map((item: any, index: any) => (
                <Observations value={sections[0] + index} reportData={item} index={index} isClick={isClick} />
              ))}
              {/* <FilmCuttingobservations reportData={reportData} isClick={isClick} /> */}

              {/* Process – Tabber & Stringer */}
              <TabberAndStringer reportData={reportData} isClick={isClick} />

              {/* Tabber & Stringer observatios */}
              {(reportData[4].observations || []).map((item: any, index: any) => (
                <Observations value={sections[1] + index} reportData={item} index={index} isClick={isClick} />
              ))}
              {/* <TabberAndStringerObservations reportData={reportData} isClick={isClick} /> */}

              {/* Process – Layup */}
              <Layup reportData={reportData} isClick={isClick} />

              {/* Layup observatios */}
              {(reportData[5].observations || []).map((item: any, index: any) => (
                <Observations value={sections[2] + index} reportData={item} index={index} isClick={isClick} />
              ))}
              {/* <LayupObservations reportData={reportData} isClick={isClick} /> */}

              {/* Process – Lamination */}
              <Lamination reportData={reportData} isClick={isClick} />

              {/* Lamination observatios */}
              {(reportData[6].observations || []).map((item: any, index: any) => (
                <Observations value={sections[3] + index} reportData={item} index={index} isClick={isClick} />
              ))}
              {/* <LaminationObservations reportData={reportData} isClick={isClick} /> */}

              {/* Process – Framing */}
              <Framing reportData={reportData} isClick={isClick} />


              {/* Framing observatios */}
              {(reportData[7].observations || []).map((item: any, index: any) => (
                <Observations value={sections[4] + index} reportData={item} index={index} isClick={isClick} />
              ))}
              {/* <FramingObservation reportData={reportData} isClick={isClick} /> */}

              {/* Process – Flasher Testing */}
              <FlasherTesting reportData={reportData} isClick={isClick} />

              {/* Flasher Testing observatios */}
              {(reportData[8].observations || []).map((item: any, index: any) => (
                <Observations value={sections[5] + index} reportData={item} index={index} isClick={isClick} />
              ))}
              {/* <FlasherTestingObservations reportData={reportData} isClick={isClick} /> */}

              {/* Random Sample Check */}
              <RandomSampleCheck reportData={reportData} isClick={isClick} />

              {/* Random Sample Check observatios */}
              {(reportData[9].observations || []).map((item: any, index: any) => (
                <Observations value={sections[6] + index} reportData={item} index={index} isClick={isClick} />
              ))}
              {/* <RandomSampleCheckObservations reportData={reportData} isClick={isClick} /> */}

              <Table id="report_completed">
                <tbody style={{ margin: 0, padding: 0 }}>
                  <tr>
                    <HeaderCell style={{ width: "50%" }}><span>Inspection done by</span></HeaderCell>
                    <TableCell><span>{lastsection.inspection_done_by}</span></TableCell>
                  </tr>
                  <tr>
                    <HeaderCell><span>Checking together with (Customer/Manufacturer representative)</span></HeaderCell>
                    <TableCell><span>{lastsection.checking_together}</span></TableCell>
                  </tr>
                </tbody>
              </Table>

              <SignatureSection signData={signData} isClick={isClick} />

              <Footer reportData={reportData} isClick={isClick} />
            </Container>
          }
        </div>
        : reporttype === "BOM" ?
          reportData.length <= 0 ? "Loading ..." :
            <Container id="report" style={{ width: isClick ? 900 : "100%" }}>
              <Header reportData={reportData} isClick={isClick} />
              {/* Report Details */}
              <ReportDetailsSection reportData={reportData} isClick={isClick} />

              {/* Other Details */}
              <BomTableData reportData={reportData} isClick={isClick} id={"bomdetails"} value1={1} value2={8} />

              <BomTableData reportData={reportData} isClick={isClick} id={"bomdetails1"} value1={8} value2={18} />

              <Table id="report_completed">
                <tbody style={{ margin: 0, padding: 0 }}>
                  <tr>
                    <HeaderCell style={{ width: "50%" }}><span>Remarks</span></HeaderCell>
                    <TableCell><span>{reportData.length <= 0 ? "" : reportData[18]["value"][0]["value"]}</span></TableCell>
                  </tr>
                  <tr>
                    <HeaderCell style={{ width: "50%" }}><span>Verification done by</span></HeaderCell>
                    <TableCell><span>{lastsection.inspection_done_by}</span></TableCell>
                  </tr>
                </tbody>
              </Table>

              <SignatureSection signData={signData} isClick={isClick} />

              <Footer reportData={reportData} isClick={isClick} />
            </Container>
          :
          reporttype === "PDI" ?
            <div style={{
              flex: 1,
              alignItems: 'center'
            }}>
              {isClick ?
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="flex flex-col items-center">
                    {/* Loader Spinner */}
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white text-lg mt-4">Generating PDF, please wait...</p>
                  </div>
                </div>
                : ""}
              {/* content */}
              {reportData.length <= 0 ? "Loading ..." :
                <Container id="report" style={{ width: isClick ? 900 : "100%" }}>
                  <Header reportData={reportData} isClick={isClick} />
                  {/* Report Details */}
                  <ReportDetailsSection reportData={reportData} isClick={isClick} />

                  {/* Inspection Details */}
                  <InspectionDetails reportData={reportData} isClick={isClick} />

                  {/* Inpection Observations */}
                  <InpectionObservations reportData={reportData} isClick={isClick} value1={0} value2={1} />
                  <InpectionObservations reportData={reportData} isClick={isClick} value1={1} value2={2} />
                  <InpectionObservations reportData={reportData} isClick={isClick} value1={2} value2={3} />
                  <InpectionObservations reportData={reportData} isClick={isClick} value1={3} value2={4} />
                  <InpectionObservations reportData={reportData} isClick={isClick} value1={4} value2={5} />
                  <InpectionObservations reportData={reportData} isClick={isClick} value1={5} value2={6} />
                  <InpectionObservations reportData={reportData} isClick={isClick} value1={6} value2={7} />
                  <InpectionObservations reportData={reportData} isClick={isClick} value1={7} value2={8} />
                  <InpectionObservations reportData={reportData} isClick={isClick} value1={8} value2={9} />
                  <InpectionObservations reportData={reportData} isClick={isClick} value1={9} value2={10} />

                  {/* Inspection Results */}
                  <InspectionResults reportData={reportData} isClick={isClick} />

                  {/* Attachment */}
                  {reportData[4].value.length == 0 ? "" : <Attachment reportData={reportData} isClick={isClick} />}

                  <Table id="report_completed">
                    <tbody style={{ margin: 0, padding: 0 }}>
                      <tr>
                        <HeaderCell style={{ width: "50%" }}><span>Inspection done by</span></HeaderCell>
                        <TableCell><span>{lastsection.inspection_done_by}</span></TableCell>
                      </tr>
                      <tr>
                        <HeaderCell><span>Checking together with (Customer/Manufacturer representative)</span></HeaderCell>
                        <TableCell><span>{lastsection.checking_together}</span></TableCell>
                      </tr>
                    </tbody>
                  </Table>

                  <SignatureSection signData={signData} isClick={isClick} />

                  <Footer reportData={reportData} isClick={isClick} />
                </Container>
              }
            </div>
            :
            reportData.length <= 0 ? "Loading ..." :
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={ChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  {/* Stacked Bars */}
                  <Bar yAxisId="left" dataKey="dayProduction" stackId="a" fill="#28a745" name="Day Production" />
                  <Bar yAxisId="left" dataKey="nightProduction" stackId="a" fill="#f4c542" name="Night Production" />
                  {/* Line for Total Rejection */}
                  <LineChart data={ChartData}>
                    <Line yAxisId="right" type="monotone" dataKey="totalRejection" stroke="red" strokeWidth={3} dot={{ fill: "red", r: 5 }} name="Total Rejection" />
                  </LineChart>
                </BarChart>
              </ResponsiveContainer>
      }
    </>
  );
};

export default PreviewReport;