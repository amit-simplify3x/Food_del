Home page![Screenshot (534)](https://github.com/amit-simplify3x/Food_del/assets/96457909/177e4a9f-8b43-415f-99cf-7370bc2f291b)
Menu page ![Screenshot (535)](https://github.com/amit-simplify3x/Food_del/assets/96457909/79695448-e76d-4b61-89a4-01b1a54ea204)
footer section ![Screenshot (536)](https://github.com/amit-simplify3x/Food_del/assets/96457909/cd296cf8-66f4-400b-84b4-185d8135db68)
Cart page ![Screenshot (537)](https://github.com/amit-simplify3x/Food_del/assets/96457909/e51aea4a-b80d-4f34-b42c-e2ee80fc665b)
login page ![Screenshot (539)](https://github.com/amit-simplify3x/Food_del/assets/96457909/b9c7a7d2-3efa-44b9-99d2-89d9fc611784)
signup page![Screenshot (540)](https://github.com/amit-simplify3x/Food_del/assets/96457909/14e6b913-b6e9-4e41-a4c7-d4375ddd3021)

<div style={{ height: 'calc(100vh - 250px)' }} className="relative">
    {/* Left Table */}
    <div className={`relative ${(selectedDay === dayOptions.today) ? 'col-span-5' : 'col-span-4'}`}>
        <div 
            style={{
                gridTemplateColumns: `repeat(2,80px) repeat(${filteredLeftHeaders.length - 2},180px)`,
                height: '100%',
                overflowY: 'auto' // Ensure vertical scrolling
            }} 
            className="custom-table grid text-xl relative"
        >
            {/* Header Row */}
            <div className="sticky top-0 grid grid-cols-[80px_80px_repeat(${filteredLeftHeaders.length-2},180px)] bg-white z-10">
                {filteredLeftHeaders.map((el, index) => (
                    <div 
                        key={el.name}
                        className={`font-medium custom-table-head px-2.5 table-border ${el.key === 'checkbox' ? 'bg-primary' : ''}`}
                        style={{ color: '#fff' }}
                    >
                        {el.key === 'checkbox' ? (
                            <input
                                style={{ height: '15px', width: '15px' }}
                                type="checkbox"
                                onChange={e => selectAllHandler(e)}
                                checked={data?.filteredData?.every(obj => obj.confirm_for_tomorrows_dispatch)}
                            />
                        ) : el.key === 'material_code' ? (
                            <div style={{ display: 'flex', backgroundColor: '#6900ef' }} className="custom-table justify-between align-center pl-1 mt-0">
                                <input
                                    type="text"
                                    className="p-2 rounded-full w-5/6 focus:outline-none"
                                    name={el.key}
                                    placeholder={el.name}
                                    onChange={e => searchHandler(e)}
                                />
                                <Search size={20} color="#ffffff" className="mx-2"/>
                            </div>
                        ) : (
                            <p className="text-center">{el.name}</p>
                        )}
                    </div>
                ))}
            </div>
            {/* Body Rows */}
            <div className="grid grid-cols-[80px_80px_repeat(${filteredLeftHeaders.length-2},180px)]">
                {data?.filteredData?.map((obj, index) => (
                    filteredLeftHeaders.map(el => (
                        el.key === 'split_batch' ? (
                            <div className="px-2.5 table-border" style={{ background: ((index + 1) % 2 === 0) && '#F9F9F9' }} key={obj[el.key]}>
                                {checkIfCodeExists(data?.filteredData, 'batch_number', obj.batch_number) && (
                                    <div style={{ height: '15px', width: '15px', background: '#9965E2' }} className="rounded-full"></div>
                                )}
                            </div>
                        ) : el.key === 'checkbox' && component === demandPlannerTabs.dispatch ? (
                            <div className="px-2.5 table-border" style={{ background: ((index + 1) % 2 === 0) && '#F9F9F9' }} key={obj[el.key]}>
                                <input
                                    style={{ height: '15px', width: '15px' }}
                                    type="checkbox"
                                    checked={obj?.confirm_for_tomorrows_dispatch}
                                    onChange={e => selectHandler(e, obj.id)}
                                />
                            </div>
                        ) : (
                            <Tooltip
                                disableHoverListener={!addElipsis(obj[el.key]).ellipse}
                                title={obj[el.key]}
                                classes={{ tooltip: classes.tooltipStyle }}
                                interactive
                                arrow
                                key={el.key}
                            >
                                <p
                                    style={{ background: ((index + 1) % 2 === 0) && '#F9F9F9' }}
                                    className="px-2.5 table-border"
                                >
                                    {addElipsis(obj[el.key]).str}
                                </p>
                            </Tooltip>
                        )
                    ))
                )}
            </div>
        </div>
    </div>

    {/* Right Table */}
    {(selectedDay === dayOptions.tomorrow || (selectedDay === dayOptions.today && component !== "scheduled")) && (
        <div>
            <div 
                style={{
                    gridTemplateColumns: (component !== demandPlannerTabs.all) ? `repeat(${rightHeaders.length},1fr)` : '1fr',
                    height: '100%',
                    overflowY: 'auto'
                }} 
                className="right-custom-table grid text-xl shadow-2xl relative"
            >
                {/* Header Row */}
                <div className="sticky top-0 grid grid-cols-[repeat(${rightHeaders.length},1fr)] bg-white z-10">
                    {rightHeaders.map((el, index) => (
                        (!el.key && component === demandPlannerTabs.all) ? null : (
                            <div key={el.name}>
                                <p className="font-medium custom-table-head px-2.5 table-border" style={{ background: colors.primary, color: '#fff' }}>
                                    {el.name}
                                </p>
                            </div>
                        )
                    ))}
                </div>
                {/* Body Rows */}
                <div className="grid grid-cols-[repeat(${rightHeaders.length},1fr)]">
                    {data?.filteredData?.map((obj, index) => (
                        rightHeaders.map(el => (
                            el.key ? (
                                <p key={el.key} className="px-2.5 table-border" style={{ background: ((index + 1) % 2 === 0) && '#F9F9F9' }}>
                                    <span style={{ color: !obj.enabled && colors.grey }}>{obj[el.key]}</span>
                                    <button
                                        style={{ color: colors.primary }}
                                        className="ml-2 font-medium text-xl"
                                        onClick={() => viewMoreHandler(obj)}
                                    >
                                        View More
                                    </button>
                                </p>
                            ) : (
                                component !== demandPlannerTabs.all && (
                                    <div className="table-border px-2.5" style={{ background: ((index + 1) % 2 === 0) && '#F9F9F9' }} key={el.key}>
                                        <IconButton
                                            style={{ color: !obj.packing_mot_confirmation_flag ? colors.primary : colors.grey }}
                                            className={`${classes.iconBtn}`}
                                            onClick={() => {
                                                if (!obj.packing_mot_confirmation_flag) {
                                                    openEditModal(obj);
                                                }
                                            }}
                                            disabled={obj.packing_mot_confirmation_flag}
                                        >
                                            <EditOutlined fontSize="large" />
                                        </IconButton>
                                        {checkIfCodeExists(data?.filteredData, 'batch_number', obj.batch_number) ? (
                                            <IconButton
                                                style={{ color: colors.primary }}
                                                className={`${classes.iconBtn}`}
                                                onClick={() => openMergeModal(data?.filteredData?.filter(obj2 => obj2.batch_number === obj.batch_number))}
                                            >
                                                <MergeType fontSize="large" />
                                            </IconButton>
                                        ) : (
                                            <IconButton
                                                style={{ color: colors.primary }}
                                                className={`${classes.iconBtn}`}
                                                onClick={() => openSplitModal(obj)}
                                            >
                                                <Scissors size={20} color={colors.primary} />
                                            </IconButton>
                                        )}
                                    </div>
                                )
                            )
                        ))
                    )}
                </div>
            </div>
        </div>
    )}
</div>



