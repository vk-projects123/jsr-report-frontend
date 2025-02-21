import { useState, useEffect } from 'react';
import styled from 'styled-components';
import html2pdf from 'html2pdf.js';
import pdflogo from "../../images/pdflogo_transparent.png";
import { FaDownload } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { VIEW_REPORTS_API, imgUrl } from "../../Api/api.tsx";
import moment from 'moment';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

const ViewReport = () => {
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

  var utoken = localStorage.getItem('userToken');
  const [isLoaded, setLoaded] = useState(false);
  var [reportData, setReportdata] = useState([]);
  var [lastsection, setLastsection] = useState<any>({});

  useEffect(() => {
    console.log("reportData", reportData);
    setLoaded(true);
    listsectiondatas();
  }, [data]);

  const Header = ({ reportData, isClick }) => {
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
              {reporttype == "IPQC" ? "In Process Inspection Daily Report" : "In Process Raw material verification"}
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
              {moment(
                reportData[0].value.find((item) => item.param_name === "Date")?.value
              ).format("DD-MM-YYYY")}
            </div>
            <div>
              Report No:{" "}
              {reportData[0].value.find((item) => item.param_name === "Report No")
                ?.value}
            </div>
          </ReportDetails>
        </HeaderRow>

    );
  };

  const Footer = ({ reportData, isClick }) => {
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

  const ReportDetailsSection = ({ reportData, isClick }) => {
    return (
      <div className="content" id="ReportDetailsSection">
        <p className={isClick ? "pdf-span " : ""} style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }}>Report Details –</p>
        <Table>
          <tbody>
            {reportData[0].value.map((item: any, index: any) => {
              // Skip "Shift" as it's being merged with "Date"
              if (item.param_name === "Shift") return null;

              // Find the "Shift" value
              const shiftItem = reportData[0].value.find((i: any) => i.param_name === "Shift");

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
                          <span>{moment(item.value).format("DD-MM-YYYY")} / {shiftItem ? shiftItem.value : ''}</span>
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
                          <span>{reportData[0].value[index + 1].value}</span>
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

  const ProductStageWise = ({ reportData, isClick }) => {
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

  const MajorObservations = ({ reportData, isClick, value1, value2 }) => {
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
                                height: 250,
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

  const FilmCutting = ({ reportData, isClick }) => {
    return (
      <div className="content" id="FilmCutting">
        <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }}>In Process Inspection Report –</p>
        <br />
        <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', color: '#000' }}>Process – Film Cutting</p>
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

  const FilmCuttingobservations = ({ reportData, isClick }) => {
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
                          <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{ padding: 5, height: 250, width: rowImages.length % 2 === 0 ? '100%' : "45%" }} />
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

  const TabberAndStringer = ({ reportData, isClick }) => {
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

  const TabberAndStringerObservations = ({ reportData, isClick }) => {
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
                          <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{ padding: 5, height: 250, width: rowImages.length % 2 === 0 ? '100%' : "45%" }} />
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

  const Layup = ({ reportData, isClick }) => {
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

  const LayupObservations = ({ reportData, isClick }) => {
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
                          <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{ padding: 5, height: 250, width: rowImages.length % 2 === 0 ? '100%' : "45%" }} />
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

  const Lamination = ({ reportData, isClick }) => {
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

  const LaminationObservations = ({ reportData, isClick }) => {
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
                          <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{ padding: 5, height: 250, width: rowImages.length % 2 === 0 ? '100%' : "45%" }} />
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

  const Framing = ({ reportData, isClick }) => {
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

  const FramingObservation = ({ reportData, isClick }) => {
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
                          <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{ padding: 5, height: 250, width: rowImages.length % 2 === 0 ? '100%' : "45%" }} />
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

  const FlasherTesting = ({ reportData, isClick }) => {
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

  const FlasherTestingObservations = ({ reportData, isClick }) => {
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
                          <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{ padding: 5, height: 250, width: rowImages.length % 2 === 0 ? '100%' : "45%" }} />
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

  const RandomSampleCheck = ({ reportData, isClick }) => {
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

  const RandomSampleCheckObservations = ({ reportData, isClick }) => {
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
                          <img src={`${imgUrl}${image.image}`} alt="PDF Sub" style={{ padding: 5, height: 250, width: rowImages.length % 2 === 0 ? '100%' : "45%" }} />
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

  const BomTableData = ({ reportData, id, value1, value2, isClick }) => {
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
        console.log(data.info);
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

    const sections = [
      "ReportDetailsSection",
      "bomdetails",
      "bomdetails1",
      "ProductStageWise",
      "MajorObservations",
      "MajorObservations1",
      "MajorObservations2",
      "MajorObservations3",
      "MajorObservations4",
      "MajorObservations5",
      "MajorObservations6",
      "MajorObservations7",
      "MajorObservations8",
      "MajorObservations9",
      "FilmCutting",
      "FilmCuttingobservations",
      "TabberAndStringer",
      "TabberAndStringerObservations",
      "Layup",
      "LayupObservations",
      "Lamination",
      "LaminationObservations",
      "Framing",
      "FramingObservation",
      "FlasherTesting",
      "FlasherTestingObservations",
      "RandomSampleCheck",
      "RandomSampleCheckObservations",
      "report_completed"
    ];

    const spans = document.querySelectorAll("table span");
    spans.forEach((text) => text.classList.add("pdf-span"));

    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      compress: true // Enable PDF compression
    });

    const pageHeight = 297;
    const margin = 10;
    const headerHeight = 20;
    const footerHeight = 10;
    const pageNumberOffset = 10;
    let yOffset = margin + headerHeight + 5;
    let pageNumber = 1;
    let totalPages = 1; // Placeholder for total pages

    const convertToImage = async (element) => {
      return html2canvas(element, {
        scale: 1, useCORS: true, logging: false,
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
        pdf.addImage(footerImage, "PNG", margin, pageHeight - footerHeight - margin - pageNumberOffset, 190, footerHeight + paddingTop);
        pdf.setFontSize(10);
        pdf.text(`Page No: ${currentPage} / ${totalPages}`, 160, pageHeight - margin - 5);
      };

      pdf.addImage(headerImage, "PNG", margin, margin, 190, headerHeight);

      let pageIndexes = [];

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

        if (yOffset + sectionHeight + footerHeight > pageHeight - margin) {
          pageIndexes.push(pageNumber);
          pdf.addPage();
          pageNumber++;
          yOffset = margin;

          pdf.addImage(headerImage, "PNG", margin, margin, 190, headerHeight);
          yOffset = margin + headerHeight + 5;
        }

        pdf.addImage(sectionImage, "PNG", margin, yOffset, 190, sectionHeight);
        yOffset += sectionHeight + 5;
      }

      totalPages = pdf.internal.getNumberOfPages(); // Get total pages

      // Update footers with total page count
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
      <button className="add-btn mx-2" onClick={() => navigate(-1)}>
        Back
      </button>
      {reporttype === "IPQC" ?
        <div style={{
          flex: 1,
          alignItems: 'center'
        }}>
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
              <FilmCuttingobservations reportData={reportData} isClick={isClick} />

              {/* Process – Tabber & Stringer */}
              <TabberAndStringer reportData={reportData} isClick={isClick} />

              {/* Tabber & Stringer observatios */}
              <TabberAndStringerObservations reportData={reportData} isClick={isClick} />

              {/* Process – Layup */}
              <Layup reportData={reportData} isClick={isClick} />

              {/* Layup observatios */}
              <LayupObservations reportData={reportData} isClick={isClick} />

              {/* Process – Lamination */}
              <Lamination reportData={reportData} isClick={isClick} />

              {/* Lamination observatios */}
              <LaminationObservations reportData={reportData} isClick={isClick} />

              {/* Process – Framing */}
              <Framing reportData={reportData} isClick={isClick} />

              {/* Framing observatios */}
              <FramingObservation reportData={reportData} isClick={isClick} />

              {/* Process – Flasher Testing */}
              <FlasherTesting reportData={reportData} isClick={isClick} />

              {/* Flasher Testing observatios */}
              <FlasherTestingObservations reportData={reportData} isClick={isClick} />

              {/* Random Sample Check */}
              <RandomSampleCheck reportData={reportData} isClick={isClick} />

              {/* Random Sample Check observatios */}
              <RandomSampleCheckObservations reportData={reportData} isClick={isClick} />

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
              <Footer reportData={reportData} isClick={isClick} />
            </Container>
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
                        <TableCell rowSpan="6" className='srno'><span>1</span></TableCell>
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
                        <TableCell rowSpan="3" className='srno'><span>2</span></TableCell>
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

export default ViewReport;