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

  const [mflData, setMflData] = useState({
    data: [],
    filteredData: [],
  });
  const [coPackerData, setCoPackerData] = useState({
    data: [],
    filteredData: [],
  });
  const [directBillingData, setDirectBillingData] = useState({
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
  const [selectedDateTemp, setSelectedDateTemp] = useState();
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
  const [totalDataLenght, setTotalDataLenght] = useState();
  // const[mflData,setMflData]=useState();
  // const[coPackerData,setCoPackerData]=useState();
  // const[directBillingData,setDirectBillingData]=useState();
  const [tabData, setTabData] = useState({
    scheduled: { data: [], filteredData: [] },
    dispatch: { data: [], filteredData: [] },
    all: { data: [], filteredData: [] },
  });
  let countMflInevetory = 0;
  let countCoPackers = 0;
  let countDirectBilling = 0;
const [searchData,setSearchData]=useState({})
  const getDemandPlanningData = (data) => {
    // console.log("line 119 get", data.activeTab);
    const value = data.activeTab;
    if (selectedDay === dayOptions.today) {
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
        if (value === "mfl_inventory") {
          setData({
            data: data || [],
            filteredData: data?.data?.mfl_inventory || [],
          });
        } else if (value === "co_packers") {
          setData({
            data: data || [],
            filteredData: data?.data?.co_packer || [],
          });
        } else if (value === "direct_billing") {
          setData({
            data: data || [],
            filteredData: data?.data?.direct_billing || [],
          });
        } else {
          setData({
            data: data || [],
            filteredData: data?.data?.mfl_inventory || [],
          });
        }

        const v1 = data?.data?.mfl_inventory;
        const v2 = data?.data?.direct_billing;
        const v3 = data?.data?.co_packer;

        setMflData({
          data: data || [],
          filteredData: v1 || [],
        });
        setCoPackerData({
          data: data || [],
          filteredData: v3 || [],
        });
        setDirectBillingData({
          data: data || [],
          filteredData: v2 || [],
        });

        // setContainers((prevContiners) =>
        //   prevContiners.map((container) =>
        //     container.key === activeTab
        //       ? { ...container, count: mflData.filteredData.length }
        //       : container

        //   )
        // );

        setShowSubComponentTabs(true);
      }
    );
  };

  const getAllDPData = (data) => {
    const value = data.activeTab;

    asynchronous.getAllDPO(
      {
        ...data,
      },
      setLoading,
      (data) => {
        // console.log('data',data?.data)
        const totalLength = data?.data?.length || 0;
        // setData({
        //   data: data || [],
        //   filteredData: data?.data || [],
        // });
        if (value === "mfl_inventory") {
          setData({
            data: data || [],
            filteredData: data?.data?.mfl_inventory || [],
          });
        } else if (value === "co_packers") {
          setData({
            data: data || [],
            filteredData: data?.data?.co_packer || [],
          });
        } else if (value === "direct_billing") {
          setData({
            data: data || [],
            filteredData: data?.data?.direct_billing || [],
          });
        } else {
          setData({
            data: data || [],
            filteredData: data?.data?.mfl_inventory || [],
          });
        }
        // console.log("line 237 actual data", data);
        const v1 = data?.data?.mfl_inventory;
        const v2 = data?.data?.direct_billing;
        const v3 = data?.data?.co_packer;

        setMflData({
          data: data || [],
          filteredData: v1 || [],
        });
        setCoPackerData({
          data: data || [],
          filteredData: v3 || [],
        });
        setDirectBillingData({
          data: data || [],
          filteredData: v2 || [],
        });

        setShowSubComponentTabs(true);
        // setContainers((prevContiners) =>
        //   prevContiners.map((container) =>
        //     container.key === activeTab
        //       ? { ...container, count: totalLength }
        //       : container
        //   )
        // );
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

    setSelectedDateTemp(selectedDay);
    setApplyFiltersData(data);
    const dataWithActiveTab = {
      ...data,
      activeTab: activeTab,
    };

    getDemandPlanningData(dataWithActiveTab);
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
    const newData = data?.filteredData?.map((obj) => ({
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
    const newData = data?.filteredData?.map((obj) => {
      if (obj.id === code) {
        // console.log(code);
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
          activeTab,
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
            activeTab,
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
        const dataWithActiveTab = {
          ...data,
          activeTab: activeTab,
        };

        getDemandPlanningData(dataWithActiveTab);
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
          setShowSuccessModal(false)
          clearTimeout(timer);
        }, 3000);
        getDemandPlanningData({ status: component, ...obj,activeTab});
        setConfirmModalData({ data: [], filteredData: [] });
      }
    });
  };

  const getTodayData = (data) => {
    const value = data.activeTab;

    asynchronous.getArchivealData(
      {
        status: component,
        ...data,
      },
      setLoading,
      (data) => {
        // console.log('data',data)
        const totalLength = data?.data?.length || 0;
        // setData({
        //   data: data?.data || [],
        //   filteredData: data?.data || [],
        // });
        if (value === "mfl_inventory") {
          setData({
            data: data || [],
            filteredData: data?.data?.mfl_inventory || [],
          });
        } else if (value === "co_packers") {
          setData({
            data: data || [],
            filteredData: data?.data?.co_packer || [],
          });
        } else if (value === "direct_billing") {
          setData({
            data: data || [],
            filteredData: data?.data?.direct_billing || [],
          });
        } else {
          setData({
            data: data || [],
            filteredData: data?.data?.mfl_inventory || [],
          });
        }
        // console.log("line 237 actual data", data);
        const v1 = data?.data?.mfl_inventory;
        const v2 = data?.data?.direct_billing;
        const v3 = data?.data?.co_packer;

        setMflData({
          data: data || [],
          filteredData: v1 || [],
        });
        setCoPackerData({
          data: data || [],
          filteredData: v3 || [],
        });
        setDirectBillingData({
          data: data || [],
          filteredData: v2 || [],
        });
        setShowSubComponentTabs(true);
        // setContainers((prevContiners) =>
        //     prevContiners.map((container) =>{
        //       container.key === activeTab
        //         ? { ...container, count: totalLength }
        //         : container

        //     }
        //     )
        //   );
      }
    );
  };

  const openNewBatchModal = (data) => {
    if (!data) return;
    asynchronous.getDemandPlanning(
      {
        status: demandPlannerTabs.addNewBatch,
        ...data,
      },
      setLoading,
      (data) => {
        if (data) {
          // console.log("line 420 modal", data);
          setOpenAddBatchModal(true);
          const v1 = data?.data?.mfl_inventory;
          const v2 = data?.data?.direct_billing;
          const v3 = data?.data?.co_packer;
          const combineData = [...v1, ...v2, ...v3];
          setBatchModalData({
            data: data || [],
            filteredData: combineData || [],
          });
          // console.log("line 496 ", batchModalData);
        }
      }
    );
  };

  const openConfirmModalHandler = () => {
    setOpenConfirmModal(true);
    const combinedData = [
      ...mflData.filteredData,
      ...coPackerData.filteredData,
      ...directBillingData.filteredData,
    ];
console.log("line 516",combinedData);

    if (component === demandPlannerTabs.scheduled) {
      setConfirmModalData({ data: {}, filteredData: combinedData });
      return;
    }

    // console.log("combine data line 441", combinedData);

    const newData = combinedData?.filter(
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
    // console.log(data);
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
          activeTab,
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
          activeTab,
        });
        setOpenMergeBatchModal({ open: false });
      }
    });
  };

  const searchHandler = (e) => {
    const {name, value} = e.target;
    console.log(data?.filteredData)
    let arr = [...data?.filteredData];
    const newObj = {
        ...searchData,
        [name]:value
    };
    // console.log(newObj);
    setSearchData(newObj);
    (() => {
        Object.keys(newObj).forEach(key => {
            arr = arr.filter(el => `${el[key]}`.toLowerCase().includes(`${newObj[key]}`.toLowerCase()))
        })
        setData({
            ...data,
            filteredData:arr
        })
    })();
}

  useEffect(() => {
    if (activeTab && Object.keys(applyFiltersData).length > 0) {
      // console.log("line 419 subtab",selectedDay)
      // getDemandPlanningData({ ...applyFiltersData, sub_tab: activeTab });
      if (activeTab === "mfl_inventory") {
        setData(mflData);
      } else if (activeTab === "co_packers") {
        setData(coPackerData);
      } else {
        setData(directBillingData);
      }
    }
  }, [activeTab]);

  // console.log("line 436 dplayout", selectedDateTemp);
  useEffect(() => {
    // getDemandPlanningData()
    getFilters();
  }, []);
  //  console.log("line 498",mflData.filteredData.length)
  //  console.log("line 499",coPackerData.filteredData.length)
  //  console.log("line 500",directBillingData.filteredData.length)
  return (
    <MainLayoutContainer title={"Demand Planning"} subTitle={""}>
      <Tabs
        tabs={tabArr}
        hideBtn={true}
        numbers={{
          ...numbers,
          [component]:
            mflData.filteredData.length +
              coPackerData.filteredData.length +
              directBillingData.filteredData.length || 0,
        }}
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
          selectedDateTemp={selectedDateTemp}
          setSelectedDateTemp={setSelectedDateTemp}
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
              mflData={mflData}
              coPackerData={coPackerData}
              directBillingData={directBillingData}
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
                searchHandler={searchHandler}
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


