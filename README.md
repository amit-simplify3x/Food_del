Home page![Screenshot (534)](https://github.com/amit-simplify3x/Food_del/assets/96457909/177e4a9f-8b43-415f-99cf-7370bc2f291b)
Menu page ![Screenshot (535)](https://github.com/amit-simplify3x/Food_del/assets/96457909/79695448-e76d-4b61-89a4-01b1a54ea204)
footer section ![Screenshot (536)](https://github.com/amit-simplify3x/Food_del/assets/96457909/cd296cf8-66f4-400b-84b4-185d8135db68)
Cart page ![Screenshot (537)](https://github.com/amit-simplify3x/Food_del/assets/96457909/e51aea4a-b80d-4f34-b42c-e2ee80fc665b)
login page ![Screenshot (539)](https://github.com/amit-simplify3x/Food_del/assets/96457909/b9c7a7d2-3efa-44b9-99d2-89d9fc611784)
signup page![Screenshot (540)](https://github.com/amit-simplify3x/Food_del/assets/96457909/14e6b913-b6e9-4e41-a4c7-d4375ddd3021)

 <div style={{
                height:'calc(100vh - 250px)' ,
                // gridTemplateRows:`repeat(${data?.totalCount || 10},auto)`
                }}  className="grid grid-cols-5 overflow-y-scroll relative">
                {/* left table */}
                <div className={` relative
                    ${(selectedDay === dayOptions.today) ? 'col-span-5' : 'col-span-4'} 
                    `
                }>
                    <div 
                        style={{
                            gridTemplateColumns:`repeat(2,80px) repeat(${filteredLeftHeaders.length-2},180px)`
                         }} className="custom-table grid text-xl overflow-x-scroll">
                        {filteredLeftHeaders.map((el, index) => (
                            (el.key === 'checkbox' && component === demandPlannerTabs.dispatch)?
                            <div className={`font-medium custom-table-head px-2.5 table-border`}
                                key={el.name}
                                style={{
                                    background:colors.primary,
                                    color:'#fff'
                                    }}
                            >
                                <input style={{
                                    height:'15px',
                                    width:'15px',
                                }} type="checkbox" 
                                onChange={e => selectAllHandler(e)}
                                checked={data?.filteredData?.every(obj => obj.confirm_for_tomorrows_dispatch)}
                                />
                            </div>
                            :el.key==='material_code'?<div style={{display:'flex',backgroundColor: '#6900ef'}} className="custom-table justify-between align-center pl-1 mt-0">
                            <input type="text" className="p-2 rounded-full w-5/6 focus:outline-none " name={el.key} placeholder={el.name} onChange={e => searchHandler(e)} />
                            <Search size={20} color="#ffffff" className="mx-2"/>
                        </div>:
                            <p key={el.name} style={{
                                background:colors.primary,
                                color:'#fff'
                                }} className="font-medium custom-table-head px-2.5 table-border text-center">{el.name}</p>
                        ))}
                        {
                            data?.filteredData?.map((obj,index) => {
                                const arr = filteredLeftHeaders.map(el => (
                                    el.key === 'split_batch'? <div className="px-2.5 table-border"
                                        style={{
                                            background:((index+1)%2 === 0) && '#F9F9F9'
                                        }}
                                        key={obj[el.key]}
                                    >
                                        {checkIfCodeExists(
                                            data?.filteredData,
                                            'batch_number',
                                            obj.batch_number
                                        ) && <div style={{
                                            height:'15px',
                                            width:'15px',
                                            background:'#9965E2'
                                        }} className="rounded-full"></div>}
                                    </div>
                                    :(el.key === 'checkbox' && component === demandPlannerTabs.dispatch) ? <div className="px-2.5 table-border"
                                        style={{
                                            background:((index+1)%2 === 0) && '#F9F9F9'
                                        }}
                                        key={obj[el.key]}
                                    >
                                        <input style={{
                                            height:'15px',
                                            width:'15px',
                                        }} type="checkbox" checked={obj?.confirm_for_tomorrows_dispatch}
                                        onChange={e => selectHandler(e,obj.id)}/>
                                    </div>
                                    :<Tooltip disableHoverListener={!addElipsis(obj[el.key]).ellipse} 
                                    title={obj[el.key]} 
                                    classes={{tooltip:classes.tooltipStyle}} 
                                    interactive
                                    arrow
                                    key={el.key}>
                                        <p 
                                        style={{
                                            background:((index+1)%2 === 0) && '#F9F9F9',
                                            // color:!obj.enabled && colors.grey
                                        }} 
                                        className="px-2.5 table-border">{addElipsis(obj[el.key]).str}</p>
                                    </Tooltip>
                                ))
                                return arr
                            })
                        }
                        {/* <p className="font-medium py-6 px-2.5">2</p> */}
                    </div>
                </div>
                {/* right table */}
                {(selectedDay === dayOptions.tomorrow||(selectedDay===dayOptions.today&&component!="scheduled")) && <div>
                    <div style={{
                            gridTemplateColumns:(component !== demandPlannerTabs.all) ? `repeat(${rightHeaders.length},1fr)` : '1fr',
                        }} className="right-custom-table grid text-xl shadow-2xl">
                        {rightHeaders.map((el,index) => (!el.key && component === demandPlannerTabs.all) ? null : (
                        <div key={el.name}>
                            <p style={{
                                background:colors.primary,
                                color:'#fff'
                                }} className={`font-medium custom-table-head px-2.5 table-border`}>
                                    {el.name}
                            </p>
                        </div>
                        ))}
                        {
                            data?.filteredData?.map((obj,index) => {
                                const arr = rightHeaders.map(el => {
                                    if(el.key){
                                        return(
                                            <p key={el.key} className=" px-2.5 table-border" style={{background:((index+1)%2 === 0) && '#F9F9F9'}}>
                                                <span style={{color:!obj.enabled && colors.grey}}>{obj[el.key]}</span>
                                                <button style={{color:/*!obj.enabled ? colors.grey : */colors.primary}} className="ml-2 font-medium text-xl"
                                                    onClick={() => viewMoreHandler(obj)}
                                                >
                                                    View More
                                                </button>
                                            </p>
                                        )
                                    }else{
                                        return(
                                            component !== demandPlannerTabs.all && <div className="table-border px-2.5 " style={{background:((index+1)%2 === 0) && '#F9F9F9'}}
                                                key={el.key}
                                            >
                                                
                                                <IconButton 
                                                style={{color:!obj.packing_mot_confirmation_flag ? colors.primary:colors.grey}} 
                                                className={`${classes.iconBtn}`}
                                                // onClick={() => openEditModal(obj)}
                                                onClick={() => {
                                                    if (!obj.packing_mot_confirmation_flag) {
                                                        openEditModal(obj);
                                                    }
                                                }}
                                                disabled={obj.packing_mot_confirmation_flag}
                    
                                             >
                                                    <EditOutlined fontSize="large" />
                                                </IconButton>
                                                {checkIfCodeExists(
                                                    data?.filteredData,
                                                    'batch_number',
                                                    obj.batch_number
                                                ) ? <IconButton style={{color:/*!obj.enabled ? colors.grey : */colors.primary}} 
                                                    className={`${classes.iconBtn}`}
                                                    onClick={() => openMergeModal(data?.filteredData?.filter(obj2 => obj2.batch_number === obj.batch_number))}
                                                    >
                                                        <MergeType fontSize="large" />
                                                    </IconButton>
                                                    : <IconButton style={{color:/*!obj.enabled ? colors.grey : */colors.primary}} 
                                                    className={`${classes.iconBtn}`}
                                                    onClick={() => openSplitModal(obj)}
                                                    >
                                                        <Scissors size={20} color={/*!obj.enabled ? colors.grey : */colors.primary} />
                                                    </IconButton>
                                                }
                                                {/* <IOSSwitch 
                                                    checked={obj.enabled}
                                                    onChange={(e) => disableRowHandler(e,obj.id)}
                                                /> */}
                                                
                                            </div>
                                        )
                                    }
                                })
                                return arr
                            })
                        }
                    </div>
                </div>}
            </div>


