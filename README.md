Home page![Screenshot (534)](https://github.com/amit-simplify3x/Food_del/assets/96457909/177e4a9f-8b43-415f-99cf-7370bc2f291b)
Menu page ![Screenshot (535)](https://github.com/amit-simplify3x/Food_del/assets/96457909/79695448-e76d-4b61-89a4-01b1a54ea204)
footer section ![Screenshot (536)](https://github.com/amit-simplify3x/Food_del/assets/96457909/cd296cf8-66f4-400b-84b4-185d8135db68)
Cart page ![Screenshot (537)](https://github.com/amit-simplify3x/Food_del/assets/96457909/e51aea4a-b80d-4f34-b42c-e2ee80fc665b)
login page ![Screenshot (539)](https://github.com/amit-simplify3x/Food_del/assets/96457909/b9c7a7d2-3efa-44b9-99d2-89d9fc611784)
signup page![Screenshot (540)](https://github.com/amit-simplify3x/Food_del/assets/96457909/14e6b913-b6e9-4e41-a4c7-d4375ddd3021)

import React from "react";
import Tabs from "../components/DispatchPlanner/Tabs";
import { useState } from "react";
import MainLayoutContainer from "./MainLayoutContainer";
import {
  addABatchHeaders,
  archivalDbHeaders,
  colors,
  confirmMotModalHeaders,
  dayOptions,
  demandPlannerFilters,
  demandPlannerStatuses,
  demandPlannerTabs,
  dpHeaders,
} from "../utils/dispatchPlanning/constants";
import SplitBatchModal from "../components/DispatchPlanner/modals/SplitBatchModal";
import ConfirmMotModal from "../components/DispatchPlanner/modals/ConfirmMotModal";
import LoadingModal from "../components/LoadingModal";
import EditMOTModal from "../components/DispatchPlanner/modals/EditMOTModal";
import DpRightSection from "../components/DispatchPlanner/DpRightSection";
import DpTable from "../components/DispatchPlanner/DpTable";
import { useEffect } from "react";
import ShipperMasterFilters from "../components/DispatchPlanner/ShipperMasterFilters";
import Image from "next/image";
import { asynchronous } from "../utils/dispatchPlanning/asynchronous";
import { downloadFile } from "../utils/helpers";
import DpSuccessModal from "../components/DispatchPlanner/modals/DpSuccessModal";
import DemandPlannerFilters from "../components/DispatchPlanner/DemandPlannerFilters";
import AddNewBatchModal from "../components/DispatchPlanner/modals/AddNewBatchModal";
import ComponentTabs from "../components/DispatchPlanner/ComponentTabs";
import DpSubComponentTabs from "../components/DispatchPlanner/DpSubComponentTab";






const DpLayout = ({ children, component }) => {
  const [tabArr, setTabArr] = useState([
    { name: "Packing Plan", link: "/dispatchplanningapi/dp", key: "scheduled" },
    {
      name: "Dispatch Plan",
      link: "/dispatchplanningapi/dp/dispatchplan",
      key: "dispatch",
    },
    { name: "All", link: "/dispatchplanningapi/dp/all", key: "all" },
    // {name:'Ready to be dispatched',link:'/dispatchplanningapi/dp/ready',key:'ready'},
  ]);

  const [numbers, setNumbers] = useState({
    scheduled: 0,
    dispatch: 0,
    all: 0,
  });
  const [data, setData] = useState({
    data: [],
    filteredData: [],
  });

  const [mflData,setMflData] = useState({
    data: [],
    filteredData: [],
  });
  const [coPackerData,setCoPackerData] = useState({
    data: [],
    filteredData: [],
  });
  const [directBillingData,setDirectBillingData] = useState({
    data: [],
    filteredData: [],
  });
  const [openEditMotModal, setOpenEditMotModal] = useState({
    open: false,
    data: null,
  });
  const [openSplitBatchModal, setOpenSplitBatchModal] = useState({
    open: false,
    data: null,
  });
  const [openMergeBatchModal, setOpenMergeBatchModal] = useState({
    open: false,
    data: null,
  });
  const [showRightSection, setShowRightSection] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coverage, setCoverage] = useState([]);
  const [filters, setFilters] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(dayOptions.tomorrow);
  const [selectedDateTemp, setSelectedDateTemp] = useState()
  const [openAddBatchModal, setOpenAddBatchModal] = useState(false);
  const [batchModalData, setBatchModalData] = useState({});
  const [confirmModalData, setConfirmModalData] = useState({});
  const [applyFiltersData, setApplyFiltersData] = useState({});
  const [total, setTotal] = useState(0);
  const [containers, setContainers] = useState([
    { key: "mfl_inventory", name: "MFL Inventory", count: 0 },
    { key: "co_packers", name: "Co Packers", count: 0 },
    { key: "direct_billing", name: "Direct Billing", count: 0 },
  ]);
  // console.log('totol data',containers[0].count+containers[1].count+containers[2].count);
  const [activeTab, setActiveTab] = useState("mfl_inventory");
  const [showSubComponentTabs, setShowSubComponentTabs] = useState(false); // New state for visibility
  const [totalDataLenght,setTotalDataLenght]=useState();
  // const[mflData,setMflData]=useState();
  // const[coPackerData,setCoPackerData]=useState();
  // const[directBillingData,setDirectBillingData]=useState();
  const [tabData, setTabData] = useState({
    scheduled: { data: [], filteredData: [] },
    dispatch: { data: [], filteredData: [] },
    all: { data: [], filteredData: [] },
  });
  let countMflInevetory=0;
  let countCoPackers = 0;
  let countDirectBilling = 0;

  const getDemandPlanningData = (data) => {
   
    if (selectedDay === dayOptions.today ) {
     getTodayData(data);
      return;
    } else if (component === demandPlannerTabs.all) {
      getAllDPData(data);
      return;
    }

    
    asynchronous.getDemandPlanning(
      {
        status: component,
        ...data,
       
      },
      setLoading,
      (data) => {
        // console.log('data 75',data?.data)
        
       const totalLength = data?.data?.length || 0;
        setData({
          data: data || [],
          filteredData: data.data.mfl_inventory || [],
        });
        const v1=data.data.mfl_inventory
        const v2=data.data.direct_billing
        const v3=data.data.co_packer
        console.log("line 150",v1)
        console.log("line 151",v2)
        console.log("line 152",v3)
        setMflData({
          data:data||[],
          filteredData:v1||[]
        })
        setCoPackerData({
          data:data||[],
          filteredData:v3||[]
        })
        setDirectBillingData({
          data:data||[],
          filteredData:v2||[]
        })
        console.log("line 129",mflData)
        console.log("line 130",coPackerData)
        console.log("line 131",directBillingData)
       
        setContainers((prevContiners) =>
          prevContiners.map((container) =>
            container.key === activeTab
              ? { ...container, count: totalLength }
              : container
          )
        );
    
        setShowSubComponentTabs(true);
      //   setContainers((prevContainers) =>
      //     prevContainers.map((container) => {
      //         if (container.key === 'mfl_inventory') {
      //             return { ...container, count: mfl.length };
      //         } else if (container.key === 'co_packers') {
      //             return { ...container, count: coPacker.length };
      //         } else if (container.key === 'direct_billing') {
      //             return { ...container, count: direct.length };
      //         } else if (container.key === activeTab) {
      //             // return { ...container, count: totalLength };
      //         } else {
      //             // return container;
      //         }
      //     })
      // );
      }
    );
  };
 
  const getAllDPData = (data) => {
    asynchronous.getAllDPO(
      {
        ...data,
       
      },
      setLoading,
      (data) => {
        // console.log('data',data?.data)
        const totalLength = data?.data?.length || 0;
        setData({
          data: data || [],
          filteredData: data?.data || [],
        });
        setShowSubComponentTabs(true);
        setContainers((prevContiners) =>
          prevContiners.map((container) =>
            container.key === activeTab
              ? { ...container, count: totalLength }
              : container
          )
        );
      }
    );
  };
  const getAll = (data) => {};

  const applyFilters = (data) => {

        setContainers((prevContainers) =>
          prevContainers.map((container) => ({
            ...container,
            count: 0,
          }))
        );
      

    setSelectedDateTemp(selectedDay)
    setApplyFiltersData(data);
    getDemandPlanningData(data);
  };

  // console.log("line 126",component)

  const getCoverageData = (code = "") => {
    asynchronous.getCoverageData(
      {
        code,
      },
      setLoading,
      (data) => {
        // console.log('data',data)
        setCoverage(data?.data[0]);
      }
    );
  };

  const getFilters = () => {
    asynchronous.getDemandPlanningFilters(setLoading, (data) => {
      // console.log('data',data)
      setFilters(data?.data || []);
    });
  };

  const selectAllHandler = (e) => {
    const newData = data?.data?.data?.map((obj) => ({
      ...obj,
      confirm_for_tomorrows_dispatch: e.target.checked,
    }));
    setData({
      data: {
        ...data.data,
        data: newData,
      },
      filteredData: newData,
    });
  };

  const selectHandler = (e, code) => {
    const newData = data?.data?.data?.map((obj) => {
      if (obj.id === code) {
        console.log(code);
        obj.confirm_for_tomorrows_dispatch = e.target.checked;
      }
      return obj;
    });
    setData({
      data: {
        ...data.data,
        data: newData,
      },
      filteredData: newData,
    });
  };

  const saveMotHandler = (data) => {
    asynchronous.updateMot(data, setLoading, (resp) => {
      if (resp) {
        setOpenEditMotModal({ open: false, data: null });
        getDemandPlanningData({
          ...data,
          status: component,
        });
      }
    });
  };

  const addNewBatch = (data) => {
    // console.log("this is",data);
    asynchronous.addNewBatchToDispatch(
      { data: data.idArr },
      setLoading,
      (resp) => {
        if (resp) {
          setOpenAddBatchModal(false);

          getDemandPlanningData({
            status: component,
            ...data.getData,
          });
        }
      }
    );
  };

  const downloadDpData = () => {
    asynchronous.downloadAllDpData(setLoading, (resp) => {
      downloadFile(resp);
    });
  };

  const viewMoreHandler = (obj) => {
    getCoverageData(obj.material_code);
    setShowRightSection(true);
  };

  const confirmMot = (obj) => {
    if (component === demandPlannerTabs.dispatch) {
      confirmDispatch(obj);
      return;
    }
    if (!obj || !component) return;
    const data = {
      ...obj,
      status: component,
    };
    // console.log(data)
    asynchronous.confirmMotPacking(data, setLoading, (resp) => {
      if (resp) {
        setOpenConfirmModal(false);
        setShowSuccessModal(true);
        const timer = setTimeout(() => {
          setShowSuccessModal(false);
          clearTimeout(timer);
        }, 3000);
        setData({ data: [], filteredData: [] });
        setConfirmModalData({ data: [], filteredData: [] });
        getDemandPlanningData(data);
      }
    });
  };

  const confirmDispatch = (obj) => {
    const idArr = confirmModalData.data.data.map((obj) => obj.id);
    asynchronous.confirmForDispatch({ data: idArr }, setLoading, (resp) => {
      if (resp) {
        setOpenConfirmModal(false);
        setShowSuccessModal(true);
        const timer = setTimeout(() => {
          setShowSuccessModal(false);
          clearTimeout(timer);
        }, 3000);
        getDemandPlanningData({ status: component, ...obj });
        setConfirmModalData({ data: [], filteredData: [] });
      }
    });
  };

  const getTodayData = (data) => {
    asynchronous.getArchivealData(
      {
        status: component,
        ...data,
        
      },
      setLoading,
      (data) => {
        // console.log('data',data)
        const totalLength = data?.data?.length || 0;
        setData({
          data: data?.data || [],
          filteredData: data?.data || [],
        });
        setShowSubComponentTabs(true);
        setContainers((prevContiners) =>
            prevContiners.map((container) =>
              container.key === activeTab
                ? { ...container, count: totalLength }
                : container
            )
          );
       
      }
    );
  };

  const openNewBatchModal = (data) => {
    if (!data) return;
    asynchronous.getDemandPlanning(
      {
        status: demandPlannerTabs.addNewBatch,
        ...data,
        sub_tab: activeTab,
      },
      setLoading,
      (data) => {
        if (data) {
          // console.log(data)
          setOpenAddBatchModal(true);
          setBatchModalData({
            data: data || [],
            filteredData: data?.data || [],
          });
        }
      }
    );
  };

  const openConfirmModalHandler = () => {
    setOpenConfirmModal(true);
    if (component === demandPlannerTabs.scheduled) {
      setConfirmModalData(data);
      return;
    }
    const newData = data?.data?.data?.filter(
      (obj) => obj.confirm_for_tomorrows_dispatch
    );
    setConfirmModalData({
      data: {
        ...data.data,
        data: newData,
      },
      filteredData: newData,
    });
  };

  const confirmForDispatch = (data) => {
    console.log(data);
  };

  const saveSplitBatches = (data) => {
    // console.log(data)
    // return;
    asynchronous.splitBatches(data.data, setLoading, (resp) => {
      if (resp) {
        setOpenSplitBatchModal({ open: false });
        getDemandPlanningData({
          ...data.getData,
          status: selectedDay === dayOptions.today ? "batchRelease" : component,
        });
        setOpenMergeBatchModal({ open: false });
      }
    });
  };

  const mergeAndSave = (data) => {
    // console.log(data)
    // return;
    asynchronous.mergeBatches(data.data, setLoading, (resp) => {
      if (resp) {
        setOpenSplitBatchModal({ open: false });
        getDemandPlanningData({
          ...data.getData,
          status: selectedDay === dayOptions.today ? "batchRelease" : component,
        });
        setOpenMergeBatchModal({ open: false });
      }
    });
  };

  useEffect(() => {
    if (activeTab && Object.keys(applyFiltersData).length > 0) {
        // console.log("line 419 subtab",selectedDay)
        // getDemandPlanningData({ ...applyFiltersData, sub_tab: activeTab });
        if(activeTab==='mfl_inventory'){
          setData(
           mflData);
        }
        else if(activeTab==='co_packers'){
          setData(coPackerData);
        }
        else{
          setData(directBillingData);
        }
    }
  }, [activeTab]);

  // console.log("line 436 dplayout", selectedDateTemp);
  useEffect(() => {
    // getDemandPlanningData()
    getFilters();
  }, []);

  return (
    <MainLayoutContainer title={"Demand Planning"} subTitle={""}>
      <Tabs
        tabs={tabArr}
        hideBtn={true}
        numbers={{ ...numbers, [component]: containers[0].count+containers[1].count+containers[2].count}}
      />
      <div className="mx-4">
        <DemandPlannerFilters
          filters={demandPlannerFilters}
          filterWidth={"15rem"}
          filterMt={4}
          searchBtnText={"Apply"}
          dpFilterData={filters}
          applyFilters={applyFilters}
          // clearHandler={() => setData({data:[],filteredData:[]})}
          hideClearBtn={true}
          downloadData={downloadDpData}
          showOptimizerOutputBtn={component !== demandPlannerTabs.all}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          selectedDateTemp = {selectedDateTemp}
          setSelectedDateTemp = {setSelectedDateTemp}
          data={data}
          openAddBatchModal={openNewBatchModal}
          component={component}
          openConfirmModal={openConfirmModalHandler}
          hideTentativeDateRange={component !== demandPlannerTabs.all}
         
        />
        <div className="">
          {showSubComponentTabs && (
            <DpSubComponentTabs
              tabs={containers}
              activeTab={activeTab}
              tabClickHandler={(key) => {
                setActiveTab(key);
              }}
            />
          )}
        </div>

        {data?.data?.length === 0 ? (
          <div
            style={{ display: "flex" }}
            className="items-center justify-center mt-4"
          >
            <Image src="/dp_no_filters.jpg" width={400} height={400} />
            <p
              style={{ color: "#9965E2" }}
              className="w-1/4 dp-no-filter ml-4 tracking-wide leading-normal"
            >
              Kindly select the required filters to view the data
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 ">
            <div
              className={`${
                showRightSection ? "col-span-2" : "col-span-3"
              } mr-4`}
            >
              <div className=""></div>
              <DpTable
                //((selectedDay === dayOptions.today&&component==="scheduled") ? archivalDbHeaders :dpHeaders)
                leftHeaders={(selectedDateTemp === dayOptions.today 
                  ? archivalDbHeaders
                  : dpHeaders
                ).left.filter((obj) => {
                  if (
                    component === demandPlannerTabs.all ||
                    component === demandPlannerTabs.scheduled ||
                    data?.data?.confirm_for_mot_packing
                  ) {
                    if (obj.key !== "checkbox") return obj;
                  } else return obj;
                 
                })}
                rightHeaders={(selectedDateTemp === dayOptions.today 
                  ? archivalDbHeaders
                  : dpHeaders
                ).right.filter((obj) => {
                  if (data?.data?.confirm_for_mot_packing) {
                    if (obj.key) return obj;
                  } else return obj;
                })}
                // leftHeaders={dpHeaders.left}
                // rightHeaders={dpHeaders.right}
                data={data}
                // handleChange={handleValueChange}
                openEditModal={(data) => {
                  setOpenEditMotModal({ open: true, data: data });
                  getCoverageData(data.material_code);
                }}
                openSplitModal={(data) =>
                  setOpenSplitBatchModal({ open: true, data: data })
                }
                openMergeModal={(data) =>
                  setOpenMergeBatchModal({ open: true, data: data })
                }
                viewMoreHandler={viewMoreHandler}
                // openViewVerModal={compareData}
                // disableRowHandler={disableRowHandler}
                // getData={getPalletData}
                selectAllHandler={selectAllHandler}
                selectHandler={selectHandler}
                selectedDay={selectedDateTemp}
                component={component}
              />
            </div>
            {showRightSection && (
              <div className="dp-right-section p-4 col-span-1 rounded-2xl">
                <DpRightSection
                  data={coverage}
                  closeRightSection={() => setShowRightSection(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <EditMOTModal
        open={openEditMotModal.open}
        data={openEditMotModal.data}
        coverage={coverage}
        handleClose={() => setOpenEditMotModal({ open: false, data: null })}
        saveMotHandler={saveMotHandler}
      />
      <SplitBatchModal
        open={openSplitBatchModal.open}
        data={openSplitBatchModal.data}
        handleClose={() => setOpenSplitBatchModal({ open: false, data: null })}
        saveFormHandler={saveSplitBatches}
      />
      <SplitBatchModal
        isMerge={true}
        open={openMergeBatchModal.open}
        data={openMergeBatchModal.data}
        handleClose={() => setOpenMergeBatchModal({ open: false, data: null })}
        mergeAndSave={mergeAndSave}
      />
      <ConfirmMotModal
        open={openConfirmModal}
        headers={confirmMotModalHeaders}
        data={confirmModalData}
        submitHandler={confirmMot}
        handleClose={() => setOpenConfirmModal(false)}
      />
      <DpSuccessModal
        open={showSuccessModal}
        handleClose={() => setShowSuccessModal(false)}
      />
      <AddNewBatchModal
        open={openAddBatchModal}
        handleClose={() => setOpenAddBatchModal(false)}
        headers={addABatchHeaders}
        data={batchModalData}
        setData={setBatchModalData}
        submitHandler={addNewBatch}
      />
      <LoadingModal isShown={loading} />
    </MainLayoutContainer>
  );
};

export default DpLayout;

