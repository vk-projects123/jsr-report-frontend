import ChartOne from '../../components/ChartOne.tsx';
// import ChartThree from '../../components/ChartThree.tsx';
// import ChartTwo from '../../components/ChartTwo.tsx';
// import ChatCard from '../../components/ChatCard.tsx';
// import MapOne from '../../components/MapOne.tsx';
// import TableOne from '../../components/TableOne.tsx';
import { useState, useEffect } from "react";
import CardOne from '../../components/CardOne.tsx';
import { GET_DASHBOARD_API } from "../../Api/api.tsx";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ECommerce = () => {

  const [isLoaded, setLoaded] = useState(false);
  const [count, setCount] = useState<any>({
    total_ipqc: 0,
    total_bom: 0,
    total_dpr: 0
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      var utoken = localStorage.getItem('userToken');
      const response = await fetch(GET_DASHBOARD_API, {
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
        setCount(data.info);
        setLoaded(false);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      setLoaded(false);
    }
  };


  const ChartData = [
    { date: "12/01/2024", dayProduction: 120, nightProduction: 222, totalRejection: 50 },
    { date: "12/02/2024", dayProduction: 350, nightProduction: 334, totalRejection: 70 },
    { date: "12/03/2024", dayProduction: 280, nightProduction: 310, totalRejection: 45 },
    { date: "12/04/2024", dayProduction: 190, nightProduction: 250, totalRejection: 60 },
    { date: "12/05/2024", dayProduction: 210, nightProduction: 180, totalRejection: 30 },
    { date: "12/06/2024", dayProduction: 400, nightProduction: 390, totalRejection: 85 },
    { date: "12/07/2024", dayProduction: 310, nightProduction: 270, totalRejection: 40 },
    { date: "12/08/2024", dayProduction: 280, nightProduction: 300, totalRejection: 55 },
    { date: "12/09/2024", dayProduction: 340, nightProduction: 290, totalRejection: 50 },
    { date: "12/10/2024", dayProduction: 220, nightProduction: 260, totalRejection: 35 },
    { date: "12/11/2024", dayProduction: 270, nightProduction: 290, totalRejection: 48 },
    { date: "12/12/2024", dayProduction: 320, nightProduction: 350, totalRejection: 55 },
    { date: "12/13/2024", dayProduction: 250, nightProduction: 275, totalRejection: 45 },
    { date: "12/14/2024", dayProduction: 380, nightProduction: 400, totalRejection: 75 },
    { date: "12/15/2024", dayProduction: 290, nightProduction: 330, totalRejection: 60 },
    { date: "12/16/2024", dayProduction: 310, nightProduction: 290, totalRejection: 52 },
    { date: "12/17/2024", dayProduction: 280, nightProduction: 310, totalRejection: 48 },
    { date: "12/18/2024", dayProduction: 360, nightProduction: 370, totalRejection: 68 },
    { date: "12/19/2024", dayProduction: 270, nightProduction: 240, totalRejection: 38 },
    { date: "12/20/2024", dayProduction: 350, nightProduction: 390, totalRejection: 72 },
    { date: "12/21/2024", dayProduction: 410, nightProduction: 430, totalRejection: 85 },
    { date: "12/22/2024", dayProduction: 290, nightProduction: 320, totalRejection: 58 },
    { date: "12/23/2024", dayProduction: 270, nightProduction: 310, totalRejection: 50 },
    { date: "12/24/2024", dayProduction: 330, nightProduction: 370, totalRejection: 65 },
    { date: "12/25/2024", dayProduction: 250, nightProduction: 290, totalRejection: 45 },
    { date: "12/26/2024", dayProduction: 380, nightProduction: 400, totalRejection: 80 },
    { date: "12/27/2024", dayProduction: 320, nightProduction: 350, totalRejection: 60 },
    { date: "12/28/2024", dayProduction: 280, nightProduction: 300, totalRejection: 55 },
    { date: "12/29/2024", dayProduction: 370, nightProduction: 390, totalRejection: 75 },
    { date: "12/30/2024", dayProduction: 290, nightProduction: 310, totalRejection: 55 }
];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* <CardOne data={{ title: 'Total Customer', value: 1 }} /> */}
        <CardOne data={{ title: 'Total IPQC', value: count.total_ipqc }} />
        <CardOne data={{ title: 'Total BOM', value: count.total_bom }} />
        <CardOne data={{ title: 'Total DPR', value: count.total_dpr }} />
      </div>

      <div className="mt-4">
        <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div className="flex w-full flex-wrap gap-3 sm:gap-5">
              <p>Production & Rejection Graph Report</p>
            </div>
            <div className="flex w-full max-w-45 justify-end">
              <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
                <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
                  Week
                </button>
                <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
                  Month
                </button>
              </div>
            </div>
          </div>

          <div>
            <div id="chartOne" className="-ml-5">
              <ResponsiveContainer width="100%" height={350} style={{ marginTop: 30 }}>
                <ComposedChart data={ChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  {/* Grid */}
                  <CartesianGrid strokeDasharray="3 3" />

                  {/* X-Axis */}
                  <XAxis dataKey="date" />

                  {/* Left Y-Axis for Production */}
                  <YAxis yAxisId="left" label={{ value: "Daily Production", angle: -90, position: "insideLeft" }} />

                  {/* Right Y-Axis for Rejection */}
                  <YAxis yAxisId="right" orientation="right" label={{ value: "Total Rejection", angle: -90, position: "insideRight" }} />

                  <Tooltip />
                  <Legend />

                  {/* Stacked Bar Chart */}
                  <Bar yAxisId="left" dataKey="dayProduction" stackId="a" fill="#28a745" name="Day Production" />
                  <Bar yAxisId="left" dataKey="nightProduction" stackId="a" fill="#f4c542" name="Night Production" />

                  {/* Line Chart for Total Rejection */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalRejection"
                    stroke="red"
                    strokeWidth={3}
                    dot={{ fill: "red", r: 5 }}
                    name="Total Rejection"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* <ChartOne />
        <ChartTwo /> */}
        {/* <ChartThree /> */}
        {/* <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard /> */}
      </div>
    </>
  );
};

export default ECommerce;
