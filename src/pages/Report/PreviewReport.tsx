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

  // const handleBackButton = () => {
  //   console.log("back button pressed!");
  //   // Pass params back to the previous screen
  //   navigate('/reports/running_report/1', { state: { Datas: data,observations:observations } });
  // };

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
      {/* <button className="add-btn mx-2" onClick={handleBackButton}>
        Back
      </button> */}
      <div>

        <>
          {/* Header */}
          {/* <div id="header" className="pdf-header" style={{ display: 'none' }}>
        <HeaderRow>
          <LogoContainer>
            <img src={pdflogo} alt="PDF Logo" style={{ padding: 5,margin:5 }} />
          </LogoContainer>
          <TitleContainer>
            <strong>In Process Inspection Daily Report</strong>
          </TitleContainer>
          <ReportDetails>
            <div>Report Date: {moment().format('DD-MM-YYYY')}</div>
            <div>Report No: IPQC-0003</div>
          </ReportDetails>
        </HeaderRow>
      </div> */}
        </>

        {/* content */}
        <Container id="report">

          {/* page 1 start */}
          <div className="content" style={{ height: isClick ? '151vh' : "" }}>
            {/* header */}
            <HeaderRow id="header" className="pdf-header">
              <LogoContainer>
                <img src={pdflogo} alt="PDF Logo" style={{ padding: 5, margin: 5 }} />
              </LogoContainer>
              <TitleContainer>
                <strong className={isClick ? 'pdf-span' : ""}>In Process Inspection Daily Report</strong>
              </TitleContainer>
              <ReportDetails>
                <div>Report Date: {moment().format('DD-MM-YYYY')}</div>
                <div>Report No: IPQC-0001</div>
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
                    <TableCell style={{ width: '25%' }}><span>{data.date}</span></TableCell>
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
          {isClick ? <div id="footer" className='footer' style={{ width: '100%' }}>
            <Table>
              <tbody>
                <tr style={{ margin: 0, padding: 0 }}>
                  <TableCell style={{ width: "50%" }}><span className='pdf-span'>Format No: JSR/SI</span></TableCell>
                  <TableCell><span className='pdf-span'>Rev Date and No: 00</span></TableCell>
                </tr>
                <tr>
                  <TableCell><span className='pdf-span'>Compiled By: Sanket Thakkar</span></TableCell>
                  <TableCell><span className='pdf-span'>Compiled Date: {moment().format('DD-MM-YYYY')}</span></TableCell>
                </tr>
              </tbody>
            </Table>
          </div> : ""}

          {/* page 1 end */}

          {/* page 2 start */}
          {/* <div className="page-break"></div> */}

          {/* header */}
          <div className="content" style={{ height: isClick ? '151vh' : "" }}>
            {isClick ? <HeaderRow id="header" className="pdf-header" style={{ marginTop: 20 }}>
              <LogoContainer>
                <img src={pdflogo} alt="PDF Logo" style={{ padding: 5, margin: 5 }} />
              </LogoContainer>
              <TitleContainer>
                <strong className='pdf-span'>In Process Inspection Daily Report</strong>
              </TitleContainer>
              <ReportDetails>
                <div className='pdf-span'>Report Date: {moment().format('DD-MM-YYYY')}</div>
                <div className='pdf-span'>Report No: IPQC-0003</div>
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
                            <img src={image} alt="PDF Sub" style={{ padding: 5,height:300 }} />
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
            <Table>
              <tbody>
                <tr style={{ margin: 0, padding: 0 }}>
                  <TableCell style={{ width: "50%" }}><span className='pdf-span'>Format No: JSR/SI</span></TableCell>
                  <TableCell><span className='pdf-span'>Rev Date and No: 00</span></TableCell>
                </tr>
                <tr>
                  <TableCell><span className='pdf-span'>Compiled By: Sanket Thakkar</span></TableCell>
                  <TableCell><span className='pdf-span'>Compiled Date: {moment().format('DD-MM-YYYY')}</span></TableCell>
                </tr>
              </tbody>
            </Table>
          </div> : ""}
          {/* page 2 end */}

          {/* page 3 start */}
          <div className="page-break"></div>

          {/* header */}
          <div className="content" style={{ height: isClick ? '151vh' : "" }}>
            {isClick ? <HeaderRow id="header" className="pdf-header" style={{ marginTop: 20 }}>
              <LogoContainer>
                <img src={pdflogo} alt="PDF Logo" style={{ padding: 5, margin: 5 }} />
              </LogoContainer>
              <TitleContainer>
                <strong className='pdf-span'>In Process Inspection Daily Report</strong>
              </TitleContainer>
              <ReportDetails>
                <div className='pdf-span'>Report Date: {moment().format('DD-MM-YYYY')}</div>
                <div className='pdf-span'>Report No: IPQC-0003</div>
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
                    <TableCell><span><strong>Round 1</strong></span></TableCell>
                    <TableCell><span><strong>Round 2</strong></span></TableCell>
                  </tr>
                  <tr>
                    <HeaderCell><span><strong>EVA Cutting length (in mm)</strong></span></HeaderCell>
                    <TableCell><span>{data.eva_cutting_length.round1}</span></TableCell>
                    <TableCell><span>{data.eva_cutting_length.round2}</span></TableCell>
                  </tr>
                  <tr>
                    <HeaderCell><span><strong>EVA thickness (in mm)</strong></span></HeaderCell>
                    <TableCell><span>{data.backsheet_cutting_length.round1}</span></TableCell>
                    <TableCell><span>{data.backsheet_cutting_length.round2}</span></TableCell>
                  </tr>
                  <tr>
                    <HeaderCell><span><strong>Raw material used records</strong></span></HeaderCell>
                    <TableCell><span>{data.raw_material_used_records.round1}</span></TableCell>
                    <TableCell><span>{data.raw_material_used_records.round2}</span></TableCell>
                  </tr>
                </tbody>

              </Table>
            </div>

            <div className="avoid-break">
              {/* Process – Tabber & Stringer */}
              <div className="avoid-break" id="productionDetails">
                <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Process – Tabber & Stringer</p>
                <Table>
                  <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
                    <tr>
                      <th style={{ border: '1px solid black', padding: '5px' }}><strong>Parameters</strong></th>
                      <th style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}><strong>Round 1</strong></th>
                      <th style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}><strong>Round 2</strong></th>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Machine No</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.machine_no.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.machine_no.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Soldering Temperature - A (°C)</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.soldering_temp_a.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.soldering_temp_a.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Soldering Temperature - B (°C)</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.soldering_temp_b.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.soldering_temp_b.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Peel Strength - Front (N)</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.peel_strength_front.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.peel_strength_front.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Peel Strength - Back (N)</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.peel_strength_back.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.peel_strength_back.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>All Machine Peel Strength</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.all_machine_peel_strength.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.all_machine_peel_strength.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Raw Material Track Records</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.raw_material_track_records.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.raw_material_track_records.round2}</span></td>
                    </tr>
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
                    <th style={{ border: '1px solid black', padding: '5px' }}><strong>Round 1</strong></th>
                    <th style={{ border: '1px solid black', padding: '5px' }}><strong>Round 2</strong></th>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Workstation No</strong></span></td>
                    <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.work_station_no.round1}</span></td>
                    <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.work_station_no.round2}</span></td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Running Module Serial No.</strong></span></td>
                    <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.running_module_serial_no.round1}</span></td>
                    <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.running_module_serial_no.round2}</span></td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Soldering Station Temperature (°C)</strong></span></td>
                    <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.soldering_station_temp.round1}</span></td>
                    <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.soldering_station_temp.round2}</span></td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Soldering Station Calibration</strong></span></td>
                    <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.soldering_station_calibration.round1}</span></td>
                    <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.soldering_station_calibration.round2}</span></td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>WIP (including Pre-Lam EL Fail & OK)</strong></span></td>
                    <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.wip.round1}</span></td>
                    <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.wip.round2}</span></td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>

          {/* footer */}
          {isClick ? <div id="footer" style={{ width: '100%' }}>
            <Table>
              <tbody>
                <tr style={{ margin: 0, padding: 0 }}>
                  <TableCell style={{ width: "50%" }}><span className='pdf-span'>Format No: JSR/SI</span></TableCell>
                  <TableCell><span className='pdf-span'>Rev Date and No: 00</span></TableCell>
                </tr>
                <tr>
                  <TableCell><span className='pdf-span'>Compiled By: Sanket Thakkar</span></TableCell>
                  <TableCell><span className='pdf-span'>Compiled Date: {moment().format('DD-MM-YYYY')}</span></TableCell>
                </tr>
              </tbody>
            </Table>
          </div> : ""}
          {/* page 3 end */}

          {/* page 4 start */}
          <div className="page-break"></div>

          {/* header */}
          <div className="content" style={{ height: isClick ? '151vh' : "" }}>
            <div className="content">
              {isClick ? <HeaderRow id="header" className="pdf-header" style={{ marginTop: 20 }}>
                <LogoContainer>
                  <img src={pdflogo} alt="PDF Logo" style={{ padding: 5, margin: 5 }} />
                </LogoContainer>
                <TitleContainer>
                  <strong className='pdf-span'>In Process Inspection Daily Report</strong>
                </TitleContainer>
                <ReportDetails>
                  <div className='pdf-span'>Report Date: {moment().format('DD-MM-YYYY')}</div>
                  <div className='pdf-span'>Report No: IPQC-0003</div>
                </ReportDetails>
              </HeaderRow> : ""}

              {/* Process – Lamination */}
              <div className="avoid-break" id="productionDetails">
                <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Process – Lamination</p>
                <Table>
                  <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
                    <tr>
                      <th style={{ border: '1px solid black', padding: '5px' }}><strong>Parameters</strong></th>
                      <th style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}><strong>Round 1</strong></th>
                      <th style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}><strong>Round 2</strong></th>
                    </tr>
                    <tr>
                      <th style={{ border: '1px solid black', padding: '5px' }}>Workstation no</th>
                      <th style={{ border: '1px solid black', padding: '5px' }}>{data.lamination_work_station_no.round1}</th>
                      <th style={{ border: '1px solid black', padding: '5px' }}>{data.lamination_work_station_no.round2}</th>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Stage 1 cycle time (in Sec)</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.stage1_cycle_time.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.stage1_cycle_time.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Stage 2 cycle time (in Sec)</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.stage2_cycle_time.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.stage2_cycle_time.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Temperature Stage 1 (°C)</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.temperature_stage1.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.temperature_stage1.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Temperature Stage 2 (°C)</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.temperature_stage2.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.temperature_stage2.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Pressure Stage 1</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.pressure_stage1.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.pressure_stage1.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Pressure Stage 2</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.pressure_stage2.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.pressure_stage2.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Last Gel Content Checked on Same Recipe</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.last_gel_content_checked.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.last_gel_content_checked.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Gel Content (%)</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.gel_content.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.gel_content.round2}</span></td>
                    </tr>
                  </tbody>
                </Table>
              </div>

            </div>
          </div>

          {/* footer */}
          <div id="footer" className='footer'>
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
          </div>
          {/* page 4 end */}

          {/* page 5 start */}
          <div className="page-break"></div>

          {/* header */}
          <div className="content" style={{ height: isClick ? '151vh' : "" }}>
            <div className="content">
              {isClick ? <HeaderRow id="header" className="pdf-header" style={{ marginTop: 20 }}>
                <LogoContainer>
                  <img src={pdflogo} alt="PDF Logo" style={{ padding: 5, margin: 5 }} />
                </LogoContainer>
                <TitleContainer>
                  <strong className='pdf-span'>In Process Inspection Daily Report</strong>
                </TitleContainer>
                <ReportDetails>
                  <div className='pdf-span'>Report Date: {moment().format('DD-MM-YYYY')}</div>
                  <div className='pdf-span'>Report No: IPQC-0003</div>
                </ReportDetails>
              </HeaderRow> : ""}

              {/* Process – Framing */}
              <div className="avoid-break" id="productionDetails">
                <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Process – Framing</p>
                <Table>
                  <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
                    <tr>
                      <th style={{ border: '1px solid black', padding: '5px' }}><strong>Parameters</strong></th>
                      <th style={{ border: '1px solid black', padding: '5px' }}><strong>Round 1</strong></th>
                      <th style={{ border: '1px solid black', padding: '5px' }}><strong>Round 2</strong></th>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Workstation No</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.framing_work_station_no.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.framing_work_station_no.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Module Width after Framing (in mm)</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.module_width_after_framing.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.module_width_after_framing.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Module Length after Framing (in mm)</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.module_length_after_framing.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.module_length_after_framing.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Frame Size (HS in mm)</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.frame_size_hs.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.frame_size_hs.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>X Pitch (in mm)</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.x_pitch.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.x_pitch.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Y Pitch (in mm)</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.y_pitch.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.y_pitch.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>RTV Consumption in Long Side Frame</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.rtv_consumption_long_side.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.rtv_consumption_long_side.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>RTV Consumption in Short Side Frame</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.rtv_consumption_short_side.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.rtv_consumption_short_side.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>RTV Back Feeling</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.rtv_back_filling.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.rtv_back_filling.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Potting Material Mixing Ratio</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.potting_material_mixing_ratio.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.potting_material_mixing_ratio.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>JB Fixing Process</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.jb_fixing_process.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.jb_fixing_process.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>JB Terminal Connections</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.jb_terminal_connections.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.jb_terminal_connections.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Raw Material Consumption Records</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.raw_material_consumption_records.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.raw_material_consumption_records.round2}</span></td>
                    </tr>
                  </tbody>

                </Table>
              </div>
            </div>
          </div>

          {/* footer */}
          <div id="footer" className='footer'>
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
          </div>
          {/* page 5 end */}

          {/* page 6 start */}
          <div className="page-break"></div>

          {/* header */}
          <div className="content" style={{ height: isClick ? '151vh' : "" }}>
            <div className="content">
              {isClick ? <HeaderRow id="header" className="pdf-header" style={{ marginTop: 20 }}>
                <LogoContainer>
                  <img src={pdflogo} alt="PDF Logo" style={{ padding: 5, margin: 5 }} />
                </LogoContainer>
                <TitleContainer>
                  <strong className='pdf-span'>In Process Inspection Daily Report</strong>
                </TitleContainer>
                <ReportDetails>
                  <div className='pdf-span'>Report Date: {moment().format('DD-MM-YYYY')}</div>
                  <div className='pdf-span'>Report No: IPQC-0003</div>
                </ReportDetails>
              </HeaderRow> : ""}

              {/* Process – Flasher Testing */}
              <div className="avoid-break" id="productionDetails">
                <p className={isClick ? "pdf-span" : ""} style={{ fontWeight: 'bold' }}>Process – Flasher Testing</p>
                <Table>
                  <tbody style={{ margin: 0, padding: 0, border: '1px solid black' }}>
                    <tr>
                      <th style={{ border: '1px solid black', padding: '5px' }}><strong>Parameters</strong></th>
                      <th style={{ border: '1px solid black', padding: '5px' }}><strong>Round 1</strong></th>
                      <th style={{ border: '1px solid black', padding: '5px' }}><strong>Round 2</strong></th>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Calibration Time</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.calibration_time.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.calibration_time.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Calibration By</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.calibration_by.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.calibration_by.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Reference Module Sr No</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.reference_module_sr_no.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.reference_module_sr_no.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Difference in Wp Measured</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.difference_in_wp_measured.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.difference_in_wp_measured.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Difference in Isc Measured</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.difference_in_isc_measured.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.difference_in_isc_measured.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Difference in Imp Measured</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.difference_in_imp_measured.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.difference_in_imp_measured.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Difference in Vmp Measured</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.difference_in_vmp_measured.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.difference_in_vmp_measured.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Difference in Voc Measured</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.difference_in_voc_measured.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.difference_in_voc_measured.round2}</span></td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span><strong>Flasher Records</strong></span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.flasher_records.round1}</span></td>
                      <td style={{ border: '1px solid black', padding: '5px' }}><span>{data.flasher_records.round2}</span></td>
                    </tr>
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
            </div>
          </div>

          {/* footer */}
          <div id="footer" className='footer'>
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
          </div>
          {/* page 6 end */}

          {/* page 7 start */}
          {/* <div className="page-break"></div> */}

          {/* header */}
          {/* <div className="content" style={{ height: isClick ? '151vh' : "" }}> */}
          {/* <div className="content">
              {isClick ? <HeaderRow id="header" className="pdf-header" style={{ marginTop: 20 }}>
                <LogoContainer>
                  <img src={pdflogo} alt="PDF Logo" style={{ padding: 5, margin: 5 }} />
                </LogoContainer>
                <TitleContainer>
                  <strong className='pdf-span'>In Process Inspection Daily Report</strong>
                </TitleContainer>
                <ReportDetails>
                  <div className='pdf-span'>Report Date: {moment().format('DD-MM-YYYY')}</div>
                  <div className='pdf-span'>Report No: IPQC-0003</div>
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
    </>
  );
};

export default PreviewReport;