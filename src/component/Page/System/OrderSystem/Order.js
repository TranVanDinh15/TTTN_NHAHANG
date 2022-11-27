import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faFileExcel, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import HeaderSystem from "../HeaderSystem/HeaderSystem";
import styles from './Order.module.scss'
import * as XLSX from 'xlsx';
import { getAllBranch } from "../../../axios/meThodPost";
import Tippy from "@tippyjs/react/headless";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { handleGetReportInDay } from "../../../handleEvent/handleEvent";
const cx = classNames.bind(styles)
const array = [
    {
        name: 'D',
        age: '18'
    },
    {
        name: 'A',
        age: '19'
    },
    {
        name: 'C',
        age: '20'
    }
]


function Order() {
    const [currentBranch, setCurrentBranch] = useState('')
    const [allBranch, setAllBranch] = useState('')
    const [allReport, setAllreport] = useState('')
    const [isLogin, setIsLogin] = useState(false)
    const userLogin = useSelector(state => state.rootLoginReducer.user)
    const handleExportExcel = () => {
        const foods = allReport.data.data.map((data, index) => {
            return {
                Number: index,
                Date: data.createAt,
                Table: data.table,
                Food: `${data.food.map((data) => {
                    return `${data.food}, `
                })}`,
                Quantity: `${data.food.map((data) => {
                    return `${data.quantity}, `
                })}`,
                UnitPrice: `${data.food.map((data) => {
                    return `${data.price}, `
                })}`,
                TotalPrice: data.totalAmount
            }
        })
        const wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(foods)
        XLSX.utils.book_append_sheet(wb, ws, 'Mysheet1')
        XLSX.writeFile(wb, "myexcel.xlsx")
    }
    console.log(allReport)
    useEffect(() => {
        getAllBranch(setAllBranch)
    }, [])
    return <div className={cx('wrapperOrder')}>
        <HeaderSystem />
        <div className={cx("UserSystem")}>
            <div className={cx("titleSystem")}>
                <h5>Báo Cáo Bán Hàng</h5>
            </div>
            <div className={cx("listTime")}>
                <Tippy
                    render={attrs => (
                        <div className="box" tabIndex="-1" {...attrs}>
                            {
                                allBranch ?
                                    allBranch.data.map((data, index) => {
                                        return (
                                            <div className={cx("box__Item")} key={index}
                                                onClick={() => {
                                                    setCurrentBranch(data)
                                                    if (userLogin) {
                                                        if (data.branchId == userLogin.branchId) {
                                                            setIsLogin(true)
                                                            handleGetReportInDay(userLogin.employeeId, setAllreport)
                                                        }
                                                    } else {
                                                        setIsLogin(false)
                                                        toast.error('Vui lòng đăng nhâpk !!', {
                                                            position: toast.POSITION.TOP_RIGHT
                                                        });
                                                    }
                                                }}
                                            >
                                                <span>{data.name}</span>
                                            </div>
                                        )
                                    })
                                    : ''
                            }
                        </div>
                    )}
                    placement={'bottom'}
                    interactive={true}
                >
                    <div className={cx("createUser")

                    }
                        onClick={() => {

                        }
                        }
                        style={{ backgroundColor: 'var(--table)' }}
                    >
                        <span>{currentBranch ? currentBranch.name : 'Chi Nhánh'}</span>
                    </div>
                </Tippy>
                {
                    isLogin ?
                        <div className={cx("roidId")}>
                            <select id="BRAND" name="CHI NHÁNH"
                                onChange={(event) => {
                                    if (event.target.value == 1) {
                                        handleGetReportInDay(userLogin.employeeId, setAllreport)
                                    }
                                }}
                            >
                                <option >Chon Thời Gian</option>
                                <option value={1}>Theo Ngày</option>
                                <option value={2}>Theo Tháng</option>
                                <option value={3}>Theo Năm</option>
                            </select>
                        </div>
                        : ''
                }
            </div>
            <div className={cx("TableSytem")}>
                <div className={cx("createUser")}
                    onClick={() => {
                        handleExportExcel()
                    }
                    }
                >
                    <FontAwesomeIcon icon={faFileExcel} />
                    <span>Xuất Excel</span>
                </div>
                <table style={{ width: "100%" }}>
                    <tbody>

                        <tr>
                            <th>Số Thứ Tự</th>
                            <th>Ngày giờ Order</th>
                            <th>Tên Bàn</th>
                            <th>Món Ăn</th>
                            <th>Số Lượng</th>
                            <th>Đơn giá</th>
                            <th>Thành Tiền</th>
                        </tr>
                        {
                            allReport ?
                                allReport.data.data.map((data, index) => {
                                    return (
                                        <tr key={index}>

                                            <td
                                            // style={{
                                            //     width: "100px",
                                            //     display: "flex",
                                            //     flexWrap: "wrap"
                                            // }}
                                            >{index}</td>
                                            <td >{data.createAt}</td>
                                            <td>{data.table}</td>
                                            <td
                                            // style={{
                                            //     width: "140px",
                                            //     display: "flex",
                                            //     flexWrap: "wrap"
                                            // }}
                                            >{data.food.map((data, index) => {
                                                return (
                                                    <span key={index}>{data.food}, </span>
                                                )
                                            })}

                                            </td>
                                            <td

                                            >{
                                                    data.food.map((data, index) => {
                                                        return (
                                                            <span key={index}>{data.quantity}, </span>
                                                        )
                                                    })
                                                }</td>
                                            <td
                                            // style={{
                                            //     width: "200px",
                                            //     display: "flex",
                                            //     flexWrap: "wrap"
                                            // }}
                                            >{data.food.map((data, index) => {
                                                return (
                                                    <span key={index}>{(data.price).toLocaleString("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    })}, </span>
                                                )
                                            })}</td>
                                            <td>{data.totalAmount.toLocaleString("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            })}</td>
                                        </tr>
                                    )
                                })
                                : ''
                        }




                    </tbody>

                </table>
            </div>
        </div>
        <ToastContainer></ToastContainer>
    </div>
}
export default Order