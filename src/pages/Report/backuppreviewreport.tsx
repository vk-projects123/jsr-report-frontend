import { useState, useEffect } from 'react';
import styled from 'styled-components';
import html2pdf from 'html2pdf.js';
import pdflogo from "../../images/pdflogo.jpg";
import { FaDownload } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment'

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
  const observations = Datas.observations;
  var datatype = Datas.pagetype;
  var otherobservations = Datas.otherobservations;

  const handleBackButton = () => {
    console.log("back button pressed!");
    // Pass params back to the previous screen
    navigate('/reports/running_report/1', { state: { reportType: datatype, Datas: data, observations: observations } });
  };

  useEffect(() => {

    // handleBackButton();

    // window.onpopstate = handleBackButton;

    return () => {
      window.onpopstate = null; // Cleanup
    };
  }, [navigate]);

  const [isClick, setIsclick] = useState(false);

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
      <button className="add-btn mx-2" onClick={handleBackButton}>
        Back
      </button>
      {datatype === "IPQC" ?
        <div>
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

              {/* Production Details */}
              {/* <div className="avoid-break" id="productionDetails">
              <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Production Details -</p>
              <Table>
              <tbody style={{ margin: 0, padding: 0 }}>
                  <tr style={{ margin: 0, padding: 0 }}>
                    <HeaderCell style={{ width: "50%" }}><span><strong>Last Working Day</strong></span></HeaderCell>
                    <TableCell><span><strong>10 Aug, 2020</strong></span></TableCell>
                  </tr>
                  <tr>
                    <HeaderCell><span><strong>Total Layup</strong></span></HeaderCell>
                    <TableCell><span>900</span></TableCell>
                  </tr>
                  <tr>
                    <HeaderCell><span><strong>Total VQC fail</strong></span></HeaderCell>
                    <TableCell><span>4</span></TableCell>
                  </tr>
                  <tr>
                    <HeaderCell><span><strong>Total after lamination EL fail</strong></span></HeaderCell>
                    <TableCell><span>3</span></TableCell>
                  </tr>
                  <tr>
                    <HeaderCell><span>< strong>Total low Wp</strong></span></HeaderCell>
                    <TableCell><span>0</span></TableCell>
                  </tr>
                  <tr>
                    <HeaderCell><span><strong>Other reject/fail</strong></span></HeaderCell>
                    <TableCell><span>Nil</span></TableCell>
                  </tr>
                </tbody>
              </Table>
            </div> */}

              {/* Production Stage Wise */}
              <div className="avoid-break" id="productionStageWise">
                <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Production Stage Wise -</p>
                <Table>
                  <tbody style={{ margin: 0, padding: 0 }}>
                    <tr>
                      <HeaderCell style={{ width: "50%" }}><span><strong>Product</strong></span></HeaderCell>
                      <TableCell><span>{data.product}</span></TableCell>
                    </tr>
                    <tr>
                      <HeaderCell><span><strong>Total Layup</strong></span></HeaderCell>
                      <TableCell><span>{data.total_layup}</span></TableCell>
                    </tr>
                    <tr>
                      <HeaderCell><span><strong>Total VQC Fail</strong></span></HeaderCell>
                      <TableCell><span>{data.total_vqc_fail}</span></TableCell>
                    </tr>
                    <tr>
                      <HeaderCell><span><strong>Total after lamination EL fail</strong></span></HeaderCell>
                      <TableCell><span>{data.total_lamination_el_fail}</span></TableCell>
                    </tr>
                    <tr>
                      <HeaderCell><span><strong>Total FQC Fail</strong></span></HeaderCell>
                      <TableCell><span>{data.total_fqc_fail}</span></TableCell>
                    </tr>
                    <tr>
                      <HeaderCell><span><strong>Total low Wp</strong></span></HeaderCell>
                      <TableCell><span>{data.total_low_wp}</span></TableCell>
                    </tr>
                    <tr>
                      <HeaderCell><span><strong>Other reject/fail</strong></span></HeaderCell>
                      <TableCell><span>{data.other_reject}</span></TableCell>
                    </tr>
                  </tbody>
                </Table>
              </div>

              {/* Dispatch Details */}
              {/* <div className="avoid-break" id="dispatchDetails">
              <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Dispatch Details – <em>“Not done for this lot”</em></p>
              <Table>
                <tbody>
                  <tr>
                    <HeaderCell style={{ width: "50%" }}><span><strong>Last Working Day</strong></span></HeaderCell>
                    <TableCell><span>&nbsp;</span></TableCell>
                    <TableCell><span>&nbsp;</span></TableCell>
                  </tr>
                  <tr>
                    <HeaderCell><span><strong>Wp in Nos</strong></span></HeaderCell>
                    <TableCell><span>&nbsp;</span></TableCell>
                    <TableCell><span>&nbsp;</span></TableCell>
                  </tr>
                  <tr>
                    <HeaderCell><span><strong>Total Dispatch Modules in Nos</strong></span></HeaderCell>
                    <TableCell><span>&nbsp;</span></TableCell>
                    <TableCell><span>&nbsp;</span></TableCell>
                  </tr>
                  <tr>
                    <HeaderCell><span><strong>Total Dispatch in MW</strong></span></HeaderCell>
                    <TableCell><span>&nbsp;</span></TableCell>
                    <TableCell><span>&nbsp;</span></TableCell>
                  </tr>
                </tbody>
              </Table>
            </div> */}
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

              {/* Major Observations of the Day */}
              <div className="avoid-break" id="majorObservations">
                <Title className={isClick ? "pdf-span" : ""}>Major Observations of the Day –</Title>
                <Table>
                  <tbody style={{ margin: 0, padding: 0 }}>
                    <tr style={{ margin: 0, padding: 0 }}>
                      <HeaderCell><span>
                        <strong>Sr No</strong>
                      </span></HeaderCell>
                      <HeaderCell colSpan={2}>
                        <span>
                          <strong>Observations / Deficiency Details</strong>
                        </span></HeaderCell>
                    </tr>

                    {observations.map((observation: any, index: any) => (
                      <>
                        <tr>
                          <TableCell rowSpan={2}>
                            <span>
                              <strong>{index + 1}</strong>
                            </span></TableCell>
                          <TableCell colSpan={2}>
                            <span>
                              {observation.description}
                            </span></TableCell>
                        </tr>
                        <tr>
                          {observation.images.map((image: any, idx: any) => (
                            <TableCell>
                              <img src={image} alt="PDF Sub" style={{ padding: 5, height: 300 }} />
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
                  <div className='pdf-span'>Report Date:  {moment(data.date).format('DD-MM-YYYY')}</div>
                  <div className='pdf-span'>Report No:  {data.reportNo}</div>
                </ReportDetails>
              </HeaderRow> : ""}

              {/* Process – Film Cutting */}
              <div className="avoid-break" id="productionDetails">
                <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold', fontSize: 18 }}>In Process Inspection Report –</p>
                <br />
                <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Process – Film Cutting</p>
                <Table>
                  <tbody style={{ margin: 0, padding: 0 }}>
                    {/* Header Row */}
                    <tr>
                      <HeaderCell><span><strong>Parameters</strong></span></HeaderCell>
                      {Object.keys(data.eva_cutting_length)
                        .filter(round => data.eva_cutting_length[round]) // Only include rounds with data
                        .map((round, index) => (
                          <TableCell key={index}><span><strong>{`Round ${index + 1}`}</strong></span></TableCell>
                        ))}
                    </tr>

                    {/* EVA Cutting Length Row */}
                    <tr>
                      <HeaderCell><span><strong>EVA Cutting length (in mm)</strong></span></HeaderCell>
                      {Object.keys(data.eva_cutting_length)
                        .filter(round => data.eva_cutting_length[round]) // Only include rounds with data
                        .map((round, index) => (
                          <TableCell key={index}><span>{data.eva_cutting_length[round]}</span></TableCell>
                        ))}
                    </tr>

                    {/* Backsheet Cutting Length Row */}
                    <tr>
                      <HeaderCell><span><strong>Backsheet Cutting length (in mm)</strong></span></HeaderCell>
                      {Object.keys(data.backsheet_cutting_length)
                        .filter(round => data.backsheet_cutting_length[round]) // Only include rounds with data
                        .map((round, index) => (
                          <TableCell key={index}><span>{data.backsheet_cutting_length[round]}</span></TableCell>
                        ))}
                    </tr>

                    {/* Raw Material Used Records Row */}
                    <tr>
                      <HeaderCell><span><strong>Raw material used records</strong></span></HeaderCell>
                      {Object.keys(data.raw_material_used_records)
                        .filter(round => data.raw_material_used_records[round]) // Only include rounds with data
                        .map((round, index) => (
                          <TableCell key={index}><span>{data.raw_material_used_records[round]}</span></TableCell>
                        ))}
                    </tr>
                  </tbody>
                </Table>
              </div>


              {/* Process – Tabber & Stringer */}
              <div className="avoid-break">
                <div className="avoid-break" id="productionDetails">
                  <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Process – Tabber & Stringer</p>
                  <Table>
                    <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
                      {/* Header Row */}
                      <tr>
                        <th style={{ border: '1px solid black', padding: '5px' }}><strong>Parameters</strong></th>
                        {Object.keys(data.machine_no)
                          .filter(round => data.machine_no[round]) // Only include rounds with data
                          .map((round, index) => (
                            <th key={index} style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>
                              <strong>{`Round ${index + 1}`}</strong>
                            </th>
                          ))}
                      </tr>

                      {/* Dynamic Rows */}
                      {[
                        { label: "Machine No", key: "machine_no" },
                        { label: "Soldering Temperature - A (°C)", key: "soldering_temp_a" },
                        { label: "Soldering Temperature - B (°C)", key: "soldering_temp_b" },
                        { label: "Peel Strength - Front (N)", key: "peel_strength_front" },
                        { label: "Peel Strength - Back (N)", key: "peel_strength_back" },
                        { label: "All Machine Peel Strength", key: "all_machine_peel_strength" },
                        { label: "Raw Material Track Records", key: "raw_material_track_records" }
                      ].map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>{row.label}</strong></span></td>
                          {Object.keys(data[row.key])
                            .filter(round => data[row.key][round]) // Only include rounds with data
                            .map((round, index) => (
                              <td key={index} style={{ border: '1px solid black', padding: '5px' }}>
                                <span>{data[row.key][round]}</span>
                              </td>
                            ))}
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
                    {/* Header Row */}
                    <tr>
                      <th style={{ border: '1px solid black', padding: '5px' }}><strong>Parameters</strong></th>
                      {Object.keys(data.work_station_no)
                        .filter(round => data.work_station_no[round]) // Only include rounds with data
                        .map((round, index) => (
                          <th key={index} style={{ border: '1px solid black', padding: '5px' }}>
                            <strong>{`Round ${index + 1}`}</strong>
                          </th>
                        ))}
                    </tr>

                    {/* Dynamic Rows */}
                    {[
                      { label: "Workstation No", key: "work_station_no" },
                      { label: "Running Module Serial No.", key: "running_module_serial_no" },
                      { label: "Soldering Station Temperature (°C)", key: "soldering_station_temp" },
                      { label: "Soldering Station Calibration", key: "soldering_station_calibration" },
                      { label: "WIP (including Pre-Lam EL Fail & OK)", key: "wip" }
                    ].map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>{row.label}</strong></span></td>
                        {Object.keys(data[row.key])
                          .filter(round => data[row.key][round]) // Only include rounds with data
                          .map((round, index) => (
                            <td key={index} style={{ border: '1px solid black', padding: '5px' }}>
                              <span>{data[row.key][round]}</span>
                            </td>
                          ))}
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
            {/* page 3 end */}


            {/* optional page 1 start */}
            {/* <div className="page-break"></div> */}
            {otherobservations.filmCutting.length > 0 ?
              <>
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

                  {/* film cutting Observations */}
                  <div className="avoid-break" id="majorObservations">
                    <Title className={isClick ? "pdf-span" : ""}>Film Cutting Observations –</Title>
                    <Table>
                      <tbody style={{ margin: 0, padding: 0 }}>
                        <tr style={{ margin: 0, padding: 0 }}>
                          <HeaderCell><span>
                            <strong>Sr No</strong>
                          </span></HeaderCell>
                          <HeaderCell colSpan={2}>
                            <span>
                              <strong>Observations / Deficiency Details</strong>
                            </span></HeaderCell>
                        </tr>

                        {otherobservations.filmCutting.map((observation: any, index: any) => (
                          <>
                            <tr>
                              <TableCell rowSpan={2}>
                                <span>
                                  <strong>{index + 1}</strong>
                                </span></TableCell>
                              <TableCell colSpan={2}>
                                <span>
                                  {observation.description}
                                </span></TableCell>
                            </tr>
                            <tr>
                              {observation.images.map((image: any, idx: any) => (
                                <TableCell>
                                  <img src={image} alt="PDF Sub" style={{ padding: 5, height: 300 }} />
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
              </> : ""}
            {/* optional page 1 end */}

            {/* optional page 2 start */}
            {/* <div className="page-break"></div> */}
            {otherobservations.tabber.length > 0 ?
              <>
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

                  {/* tabber cutting Observations */}
                  <div className="avoid-break" id="majorObservations">
                    <Title className={isClick ? "pdf-span" : ""}>Tabber Observations –</Title>
                    <Table>
                      <tbody style={{ margin: 0, padding: 0 }}>
                        <tr style={{ margin: 0, padding: 0 }}>
                          <HeaderCell><span>
                            <strong>Sr No</strong>
                          </span></HeaderCell>
                          <HeaderCell colSpan={2}>
                            <span>
                              <strong>Observations / Deficiency Details</strong>
                            </span></HeaderCell>
                        </tr>

                        {otherobservations.tabber.map((observation: any, index: any) => (
                          <>
                            <tr>
                              <TableCell rowSpan={2}>
                                <span>
                                  <strong>{index + 1}</strong>
                                </span></TableCell>
                              <TableCell colSpan={2}>
                                <span>
                                  {observation.description}
                                </span></TableCell>
                            </tr>
                            <tr>
                              {observation.images.map((image: any, idx: any) => (
                                <TableCell>
                                  <img src={image} alt="PDF Sub" style={{ padding: 5, height: 300 }} />
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
              </> : ""}
            {/* optional page 2 end */}

            {/* optional page 2 start */}
            {/* <div className="page-break"></div> */}
            {otherobservations.layup.length > 0 ?
              <>
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

                  {/* layup cutting Observations */}
                  <div className="avoid-break" id="majorObservations">
                    <Title className={isClick ? "pdf-span" : ""}>layup Observations –</Title>
                    <Table>
                      <tbody style={{ margin: 0, padding: 0 }}>
                        <tr style={{ margin: 0, padding: 0 }}>
                          <HeaderCell><span>
                            <strong>Sr No</strong>
                          </span></HeaderCell>
                          <HeaderCell colSpan={2}>
                            <span>
                              <strong>Observations / Deficiency Details</strong>
                            </span></HeaderCell>
                        </tr>

                        {otherobservations.layup.map((observation: any, index: any) => (
                          <>
                            <tr>
                              <TableCell rowSpan={2}>
                                <span>
                                  <strong>{index + 1}</strong>
                                </span></TableCell>
                              <TableCell colSpan={2}>
                                <span>
                                  {observation.description}
                                </span></TableCell>
                            </tr>
                            <tr>
                              {observation.images.map((image: any, idx: any) => (
                                <TableCell>
                                  <img src={image} alt="PDF Sub" style={{ padding: 5, height: 300 }} />
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
              </> : ""}
            {/* optional page 2 end */}

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
                    <div className='pdf-span'>Report Date:  {moment(data.date).format('DD-MM-YYYY')}</div>
                    <div className='pdf-span'>Report No:  {data.reportNo}</div>
                  </ReportDetails>
                </HeaderRow> : ""}

                {/* Process – Lamination */}
                <div className="avoid-break" id="productionDetails">
                  <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Process – Lamination</p>
                  <Table>
                    <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
                      {/* Header Row */}
                      <tr>
                        <th style={{ border: '1px solid black', padding: '5px' }}><strong>Parameters</strong></th>
                        {Object.keys(data.lamination_work_station_no)
                          .filter(key => data.lamination_work_station_no[key]) // Only include rounds with data
                          .map((round, index) => (
                            <th key={index} style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>
                              <strong>{`Round ${index + 1}`}</strong>
                            </th>
                          ))}
                      </tr>

                      {/* Data Rows */}
                      {[
                        { label: "Workstation No", key: "lamination_work_station_no" },
                        { label: "Stage 1 Cycle Time (in Sec)", key: "stage1_cycle_time" },
                        { label: "Stage 2 Cycle Time (in Sec)", key: "stage2_cycle_time" },
                        { label: "Temperature Stage 1 (°C)", key: "temperature_stage1" },
                        { label: "Temperature Stage 2 (°C)", key: "temperature_stage2" },
                        { label: "Pressure Stage 1", key: "pressure_stage1" },
                        { label: "Pressure Stage 2", key: "pressure_stage2" },
                        { label: "Last Gel Content Checked on Same Recipe", key: "last_gel_content_checked" },
                        { label: "Gel Content (%)", key: "gel_content" },
                      ].map((row, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid black', padding: '5px' }}>
                            <span><strong>{row.label}</strong></span>
                          </td>
                          {Object.keys(data[row.key])
                            .filter(key => data[row.key][key]) // Only include rounds with data
                            .map((round, index) => (
                              <td key={index} style={{ border: '1px solid black', padding: '5px' }}>
                                <span>{data[row.key][round]}</span>
                              </td>
                            ))}
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
            {/* page 4 end */}

            {/* optional page 3 start */}
            {/* <div className="page-break"></div> */}
            {otherobservations.lamination.length > 0 ?
              <>
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

                  {/* lamination cutting Observations */}
                  <div className="avoid-break" id="majorObservations">
                    <Title className={isClick ? "pdf-span" : ""}>Lamination Observations –</Title>
                    <Table>
                      <tbody style={{ margin: 0, padding: 0 }}>
                        <tr style={{ margin: 0, padding: 0 }}>
                          <HeaderCell><span>
                            <strong>Sr No</strong>
                          </span></HeaderCell>
                          <HeaderCell colSpan={2}>
                            <span>
                              <strong>Observations / Deficiency Details</strong>
                            </span></HeaderCell>
                        </tr>

                        {otherobservations.lamination.map((observation: any, index: any) => (
                          <>
                            <tr>
                              <TableCell rowSpan={2}>
                                <span>
                                  <strong>{index + 1}</strong>
                                </span></TableCell>
                              <TableCell colSpan={2}>
                                <span>
                                  {observation.description}
                                </span></TableCell>
                            </tr>
                            <tr>
                              {observation.images.map((image: any, idx: any) => (
                                <TableCell>
                                  <img src={image} alt="PDF Sub" style={{ padding: 5, height: 300 }} />
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
              </> : ""}
            {/* optional page 3 end */}

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
                    <div className='pdf-span'>Report Date:  {moment(data.date).format('DD-MM-YYYY')}</div>
                    <div className='pdf-span'>Report No:  {data.reportNo}</div>
                  </ReportDetails>
                </HeaderRow> : ""}

                {/* Process – Framing */}
                <div className="avoid-break" id="productionDetails">
                  <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Process – Framing</p>
                  <Table>
                    <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
                      {/* Header Row */}
                      <tr>
                        <th style={{ border: '1px solid black', padding: '5px' }}><strong>Parameters</strong></th>
                        {Object.keys(data.framing_work_station_no)
                          .filter(key => data.framing_work_station_no[key]) // Only include rounds with data
                          .map((round, index) => (
                            <th key={index} style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>
                              <strong>{`Round ${index + 1}`}</strong>
                            </th>
                          ))}
                      </tr>

                      {/* Data Rows */}
                      {[
                        { label: "Workstation No", key: "framing_work_station_no" },
                        { label: "Module Width after Framing (in mm)", key: "module_width_after_framing" },
                        { label: "Module Length after Framing (in mm)", key: "module_length_after_framing" },
                        { label: "Frame Size (HS in mm)", key: "frame_size_hs" },
                        { label: "X Pitch (in mm)", key: "x_pitch" },
                        { label: "Y Pitch (in mm)", key: "y_pitch" },
                        { label: "RTV Consumption in Long Side Frame", key: "rtv_consumption_long_side" },
                        { label: "RTV Consumption in Short Side Frame", key: "rtv_consumption_short_side" },
                        { label: "RTV Back Feeling", key: "rtv_back_filling" },
                        { label: "Potting Material Mixing Ratio", key: "potting_material_mixing_ratio" },
                        { label: "JB Fixing Process", key: "jb_fixing_process" },
                        { label: "JB Terminal Connections", key: "jb_terminal_connections" },
                        { label: "Raw Material Consumption Records", key: "raw_material_consumption_records" },
                      ].map((row, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid black', padding: '5px' }}>
                            <span><strong>{row.label}</strong></span>
                          </td>
                          {Object.keys(data[row.key])
                            .filter(key => data[row.key][key]) // Only include rounds with data
                            .map((round, index) => (
                              <td key={index} style={{ border: '1px solid black', padding: '5px' }}>
                                <span>{data[row.key][round]}</span>
                              </td>
                            ))}
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
            {/* page 5 end */}

            {/* optional page 4 start */}
            {/* <div className="page-break"></div> */}
            {otherobservations.framing.length > 0 ?
              <>
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

                  {/* lamination cutting Observations */}
                  <div className="avoid-break" id="majorObservations">
                    <Title className={isClick ? "pdf-span" : ""}>Framing Observations –</Title>
                    <Table>
                      <tbody style={{ margin: 0, padding: 0 }}>
                        <tr style={{ margin: 0, padding: 0 }}>
                          <HeaderCell><span>
                            <strong>Sr No</strong>
                          </span></HeaderCell>
                          <HeaderCell colSpan={2}>
                            <span>
                              <strong>Observations / Deficiency Details</strong>
                            </span></HeaderCell>
                        </tr>

                        {otherobservations.framing.map((observation: any, index: any) => (
                          <>
                            <tr>
                              <TableCell rowSpan={2}>
                                <span>
                                  <strong>{index + 1}</strong>
                                </span></TableCell>
                              <TableCell colSpan={2}>
                                <span>
                                  {observation.description}
                                </span></TableCell>
                            </tr>
                            <tr>
                              {observation.images.map((image: any, idx: any) => (
                                <TableCell>
                                  <img src={image} alt="PDF Sub" style={{ padding: 5, height: 300 }} />
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
              </> : ""}
            {/* optional page 4 end */}


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
                    <div className='pdf-span'>Report Date:  {moment(data.date).format('DD-MM-YYYY')}</div>
                    <div className='pdf-span'>Report No:  {data.reportNo}</div>
                  </ReportDetails>
                </HeaderRow> : ""}

                {/* Process – Flasher Testing */}
                <div className="avoid-break" id="productionDetails">
                  <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Process – Flasher Testing</p>
                  <Table>
                    <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
                      {/* Table Header */}
                      <tr>
                        <th style={{ border: '1px solid black', padding: '5px' }}><strong>Parameters</strong></th>
                        {Object.keys(data.calibration_time)
                          .filter(key => data.calibration_time[key]) // Only include rounds with data
                          .map((round, index) => (
                            <th key={index} style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>
                              <strong>{`Round ${index + 1}`}</strong>
                            </th>
                          ))}
                      </tr>

                      {/* Dynamic Rows */}
                      {[
                        { key: 'calibration_time', label: 'Calibration Time' },
                        { key: 'calibration_by', label: 'Calibration By' },
                        { key: 'reference_module_sr_no', label: 'Reference Module Sr No' },
                        { key: 'difference_in_wp_measured', label: 'Difference in Wp Measured' },
                        { key: 'difference_in_isc_measured', label: 'Difference in Isc Measured' },
                        { key: 'difference_in_imp_measured', label: 'Difference in Imp Measured' },
                        { key: 'difference_in_vmp_measured', label: 'Difference in Vmp Measured' },
                        { key: 'difference_in_voc_measured', label: 'Difference in Voc Measured' },
                        { key: 'flasher_records', label: 'Flasher Records' },
                      ].map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td style={{ border: '1px solid black', padding: '5px' }}>
                            <span><strong>{row.label}</strong></span>
                          </td>
                          {Object.keys(data[row.key])
                            .filter(key => data[row.key][key]) // Only include rounds with data
                            .map((round, index) => (
                              <td key={index} style={{ border: '1px solid black', padding: '5px' }}>
                                <span>{data[row.key][round]}</span>
                              </td>
                            ))}
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
                      <tr>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>1</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>Flash test</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[0].module_sr_no}</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[0].result}</span></td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>2</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>Insulation Test</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[1].module_sr_no}</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[1].result}</span></td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>3</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>High Voltage Test</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[2].module_sr_no}</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[2].result}</span></td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>4</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>Electroluminescence Test</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[3].module_sr_no}</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[3].result}</span></td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>5</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>Soldering Peel Test</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[4].module_sr_no}</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[4].result}</span></td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>6</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>Final Visual Inspection</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[5].module_sr_no}</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[5].result}</span></td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>7</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>Laminate visual inspection</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[6].module_sr_no}</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[6].result}</span></td>
                      </tr>
                      <tr>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>8</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>Ground continuity test</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[7].module_sr_no}</span></td>
                        <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.test_results[7].result}</span></td>
                      </tr>
                    </tbody>
                  </Table>
                </div>

                <Table>
                  <tbody style={{ margin: 0, padding: 0 }}>
                    <tr>
                      <HeaderCell style={{ width: "50%" }}><span><strong>Inspection done by</strong></span></HeaderCell>
                      <TableCell><span>{data.inpaction_done_by}</span></TableCell>
                    </tr>
                    <tr>
                      <HeaderCell><span><strong>Checking together with (Customer/Manufacturer representative)</strong></span></HeaderCell>
                      <TableCell><span>{data.checking_together}</span></TableCell>
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
            {/* page 6 end */}

            {/* optional page 5 start */}
            {/* <div className="page-break"></div> */}
            {otherobservations.flasher.length > 0 ?
              <>
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

                  {/* flasher Observations */}
                  <div className="avoid-break" id="majorObservations">
                    <Title className={isClick ? "pdf-span" : ""}>Flasher Observations –</Title>
                    <Table>
                      <tbody style={{ margin: 0, padding: 0 }}>
                        <tr style={{ margin: 0, padding: 0 }}>
                          <HeaderCell><span>
                            <strong>Sr No</strong>
                          </span></HeaderCell>
                          <HeaderCell colSpan={2}>
                            <span>
                              <strong>Observations / Deficiency Details</strong>
                            </span></HeaderCell>
                        </tr>

                        {otherobservations.flasher.map((observation: any, index: any) => (
                          <>
                            <tr>
                              <TableCell rowSpan={2}>
                                <span>
                                  <strong>{index + 1}</strong>
                                </span></TableCell>
                              <TableCell colSpan={2}>
                                <span>
                                  {observation.description}
                                </span></TableCell>
                            </tr>
                            <tr>
                              {observation.images.map((image: any, idx: any) => (
                                <TableCell>
                                  <img src={image} alt="PDF Sub" style={{ padding: 5, height: 300 }} />
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
              </> : ""}
            {/* optional page 5 end */}

            {/* optional page 6 start */}
            {/* <div className="page-break"></div> */}
            {otherobservations.randomsample.length > 0 ?
              <>
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

                  {/* random sample Observations */}
                  <div className="avoid-break" id="majorObservations">
                    <Title className={isClick ? "pdf-span" : ""}>Random Sample Check Observations –</Title>
                    <Table>
                      <tbody style={{ margin: 0, padding: 0 }}>
                        <tr style={{ margin: 0, padding: 0 }}>
                          <HeaderCell><span>
                            <strong>Sr No</strong>
                          </span></HeaderCell>
                          <HeaderCell colSpan={2}>
                            <span>
                              <strong>Observations / Deficiency Details</strong>
                            </span></HeaderCell>
                        </tr>

                        {otherobservations.randomsample.map((observation: any, index: any) => (
                          <>
                            <tr>
                              <TableCell rowSpan={2}>
                                <span>
                                  <strong>{index + 1}</strong>
                                </span></TableCell>
                              <TableCell colSpan={2}>
                                <span>
                                  {observation.description}
                                </span></TableCell>
                            </tr>
                            <tr>
                              {observation.images.map((image: any, idx: any) => (
                                <TableCell>
                                  <img src={image} alt="PDF Sub" style={{ padding: 5, height: 300 }} />
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
              </> : ""}
            {/* optional page 6 end */}

            {/* page 7 start */}
            {/* <div className="page-break"></div> */}

            {/* header */}
            {/* <div className="content" style={{ height: isClick ? '157vh' : "" }}> */}
            {/* <div className="content">
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

              <div className="avoid-break" id="majorObservations">
                <Table>
                  <tbody>
                    <tr>
                      <HeaderCell><span>
                        Cutting EVA film measurements
                      </span></HeaderCell>
                      <HeaderCell><span>
                        Cutting Backsheet film measurements
                      </span></HeaderCell>
                    </tr>
                    <tr>
                      <TableCell>
                        <img src={pdfsub4} alt="PDF Sub" style={{ padding: 5, height: 230 }} /></TableCell>
                      <TableCell>
                        <img src={pdfsub5} alt="PDF Sub" style={{ padding: 5, height: 230 }} /></TableCell>
                    </tr>
                    <tr>
                      <HeaderCell colSpan={2} style={{ textAlign: 'center' }}>
                        <span>
                          Raw material used records
                        </span>
                      </HeaderCell>
                    </tr>
                    <tr>
                      <TableCell colSpan={2} className='webkitcenter'>
                        <img src={pdfsub6} alt="PDF Sub" style={{ padding: 5, height: 280 }} /></TableCell>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div> */}
            {/* </div> */}

            {/* footer */}
            {/* <div id="footer" className='footer'>
            <Table>
              <tbody>
                <tr style={{ margin: 0, padding: 0 }}>
                  <TableCell style={{ width: "50%" }}><span>Format No: JSR/SI</span></TableCell>
                  <TableCell><span>Rev Date and No: 00</span></TableCell>
                </tr>
                <tr>
                  <TableCell><span>Compiled By: Sanket Thakkar</span></TableCell>
                  <TableCell><span>Compiled Date: {moment().format('DD-MM-YYYY')}</span></TableCell>
                </tr>
              </tbody>
            </Table>
          </div> */}
            {/* page 7 end */}
          </Container>
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