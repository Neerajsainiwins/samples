import { useState, useEffect, forwardRef, useCallback } from "react";
import styled from "styled-components";

import Icon from "../../../components/elements/Icon";
import { IconEnum as Icons } from "../../../components/elements/Icons";
import colors from "../../../util/Colors";
// import routePaths from "../../config/routepaths.config";
import { Dropdown, Popup } from "semantic-ui-react";
import BaseModal, { ModalList } from "../../../components/modal/BaseModal";
import API from "../../../services/api.services";
import { API_URLS } from "../../../config/api.config";
import { SuccessToast } from "../../../util/toaster";
import { DateTimeFormat } from "../../../util/TimeFormat";
import { ModalProperty, ModuleName } from "../../../util/enum";
import { storeHeaderModal } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/reducers";
import { Dispatch } from "redux";
import AdminLayout from "../AdminLayout";
import UserAdminTable from "./UserAdminTable";


const GridWrapper = styled.div`
  background-color: ${colors.white};
  margin-top: 20px;
  padding: 0;
  border-radius: 10px;
  @media screen and (max-width: 767px) {
    margin-top: 0;
    border-radius: 0px;
  }
`;

const UserImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .userImage {
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${colors.basecolor};
    border-radius: 50%;
    margin-left: -13px;
    position: relative;
    z-index: 9;
    color: ${colors.black};
    font-size: 14px;
    font-family: "euclid_circular_amedium";
  }
`;
const UserImage = styled.div`
  width: 34px;
  height: 34px;
  overflow: hidden;
  border-radius: 50%;
  object-fit: cover;
  &.overalpImage {
    margin-right: 5px;
    background: ${colors.blue};
    position: relative;
    z-index: 9;
    border: 2px solid ${colors.blue};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.white};
  }
  img {
    width: 34px;
    height: 34px;
    object-fit: cover;
  }
`;
const CheckBox = styled.label`
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  min-height: 18px;
  @media screen and (max-width: 767px) {
    right: 15px;
  }
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    &:checked ~ .checkmark {
      background-color: ${colors.blue};
      border: 2px solid ${colors.blue};
    }
    &:checked ~ .checkmark:after {
      display: block;
    }
  }
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 16px;
    width: 16px;
    background-color: ${colors.white};
    border-radius: 3px;
    border: 2px solid ${colors.grey};
    &:after {
      content: "";
      position: absolute;
      display: none;
      left: 4px;
      top: 0px;
      width: 5px;
      height: 9px;
      border: solid ${colors.white};
      border-width: 0 2px 2px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
`;
const WhiteCheckBox = styled.label`
    display: block;
    position: relative;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    min-height: 18px;
    input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
        &:checked ~ .checkmark {
            background-color: ${colors.white};
        }
        &:checked ~ .checkmark:after {
            display: block;
        }
    }
    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 18px;
        width: 18px;
        background-color: ${colors.white};
        border-radius: 3px;        
        &:after {
            content: "";
            position: absolute;
            display: none;
            left: 7px;
            top: 4px;
            width: 4px;
            height: 9px;
            border: solid ${colors.blue};
            border-width: 0 2px 0px 0;
            -webkit-transform: rotate(90deg);
            -ms-transform: rotate(90deg);
            transform: rotate(90deg);
        }
      }
`;
const FLexBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export interface IRoleProps {
  tenantId?: number;
}

const RoleList = forwardRef<any, any>((props: any) => {
  const [RoleDetailVisible, setRoleDetailModalIsVisible] = useState(false);
  const [RoleCreationVisible, setRoleCreationModalIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [getRoleList, setGetRoleList] = useState<any>([]);
  const [selectedRole, setSelectedRole] = useState<any>("");
  const currentHeaderModal = useSelector((state: RootState) => state?.global?.currentHeaderModal);
  // const [pagination, setPagination] = useState<any>({ pageNo: 1, pageSize: 10, searchValue: "", sortColumn: "", sortOrder: "" });
  const [sortState, setSortState] = useState<any>();
  const dispatch: Dispatch<any> = useDispatch()
  let selectedCheck: any = [];
  const [pagination, setPagination] = useState<any>({ pageNo: 1, pageSize: 10, searchValue: "", sortColumn: "", sortOrder: ""  });


  getRoleList.map((singleObj: any) => {
    if (singleObj.select) {
      selectedCheck.push(singleObj);
    }
    return singleObj;
  });

  const HeaderCheckbox = (e: any) => {
    let checked = e.target.checked;
    setGetRoleList(getRoleList?.map((selectedData: any) => { selectedData.select = checked; return selectedData; }));
  };

  const Checkbox = (e: any, item: any) => {
    let checked = e.target.checked;
    setGetRoleList(getRoleList?.map((data: any) => {
      if (item.roleId === data.roleId) {
        data.select = checked;
      }
      return data;
    })
    );
  };
  const deletAPI = (deletedItems: any) => {
    setLoading(true);
    API.delete(API_URLS.DeleteRoles, { data: { roleId: deletedItems } })
      .then((response: any) => {
        AdminRolelist();
        SuccessToast(response?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const deleteMultiple = (index: any) => {
    let deletedItems = selectedCheck.map((item: any) => {
      return item.roleId;
    });
    deletAPI(deletedItems);
  };
  const singleDelete = (id: any) => {
    deletAPI([id]);
  };
  const viewRoleClick = (id: any) => {
    setSelectedRole(id);

    setRoleDetailModalIsVisible(true);
  };

  const editRoleClick = (id: any) => {
    setSelectedRole(id);
    setRoleCreationModalIsVisible(true);
  };

  const AdminRolelist = (data?: any) => {
    setLoading(true);
    let paginationData = data ? data : pagination
    let pageNo = paginationData?.pageNo
    let pageSize = paginationData?.pageSize
    let sortColumn = pagination?.sortColumn.charAt(0).toUpperCase() + pagination?.sortColumn.slice(1);
    let sortOrder = pagination?.sortOrder.charAt(0).toUpperCase() + pagination?.sortOrder.slice(1);
    API.post(API_URLS.RoleList, { pageNo: pageNo, pageSize: pageSize, searchValue: "", sortColumn: sortColumn, sortOrder: sortOrder, tenantId: props?.tenantId })
      .then((response: any) => {
        setGetRoleList(response?.data?.rolesList);
        SuccessToast(response.message);
        setPagination({ ...pagination, totalPages: response?.data?.totalPages })
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    AdminRolelist();
  }, [props?.tenantId]); // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    if (currentHeaderModal) {
      if (currentHeaderModal?.moduleName === ModuleName.RoleList && currentHeaderModal?.isMoodelOpen === ModalProperty.Close) {
        AdminRolelist();
        dispatch(storeHeaderModal({ moduleName: ModuleName.RoleList, isMoodelOpen: ModalProperty.Show }));
      }
    }
  }, [currentHeaderModal]);  // eslint-disable-line react-hooks/exhaustive-deps



  let columns = [
    {
      Header: "Role name",
      accessor: "roleName",
      sortable: true,
      Cell: (({ row, item }: { row: any, item: any }) => {
        return (
          <td data-label="Role name">
            <span  onClick={() => viewRoleClick(item.roleId)}>
              {row.values.roleName}
            </span>
          </td>
        )
      })
    },
    {
      Header: "List of users",
      accessor: "userDetail",
      disableSortBy: true,
      Cell: (({ row }: { row: any }) => (
        <td data-label="List of users">
          {row.values?.userDetail && (
            <UserImageWrapper>
              {row.values.userDetail.map((data: any) => {
                return (
                  <UserImage className="overalpImage">
                    {data.userName.substring(0, 3).toUpperCase()}
                  </UserImage>
                );
              })}
            </UserImageWrapper>
          )}
        </td>
      ))
    },
    {
      Header: "Created on",
      accessor: "createdDate",
      Cell: (({ row }: { row: any }) => (
        <Popup content={DateTimeFormat(row.values.createdDate, "DD/MM/YYYY \xa0 \xa0 HH:mm:ss")} trigger={<td data-label="Creation date"><span className="companyName">       {DateTimeFormat(row.values.createdDate, "DD/MM/YYYY")}     </span>   </td>} />
      ))
    },
    {
      Header: "Last updated on",
      accessor: "modifiedDate",
      Cell: (({ row }: { row: any }) => (
        <Popup content={DateTimeFormat( row.values.modifiedDate, "DD/MM/YYYY \xa0 \xa0 HH:mm:ss"
          )}
          trigger={
            <td data-label="Creation date">
              {DateTimeFormat(row.values.modifiedDate, "DD/MM/YYYY")}
            </td>
          }
        />))
    },
    {
      Header: () => {
        return (
          <FLexBox>
            <WhiteCheckBox>
              <input
                type="checkbox"
                checked={getRoleList.length === selectedCheck.length}
                onChange={(e) => HeaderCheckbox(e)}
              ></input>
              <span className="checkmark"></span>
            </WhiteCheckBox>
            <Icon icon={Icons.DownArrow} />
          </FLexBox>
        )
      },
      accessor: "select",
      disableSortBy: true,
      Cell: (({ row }: { row: any }) => (
        <td data-label="Select" className="fixWidth">
          <CheckBox>
            <input
              type="checkbox"
              checked={row.values.select}
              onChange={(e) => {
                
                Checkbox(e, row.original  );
              }}
            ></input>
            <span className="checkmark"></span>
          </CheckBox>
        </td>
      ))
    },
    {
      Header: ({ row }: { row: any }) => {
        return (
          <Icon icon={Icons.Delete} onClick={(index: any) => deleteMultiple(index)} />
        )
      },
      accessor: "expirationDate",
      disableSortBy: true,
      Cell: (({ row }: { row: any }) =>
        (<td data-label="Action" className="fixWidth">
          <Dropdown
            icon="ellipsis vertical"
            className="icon ellipseDropDown"
          >
            <Dropdown.Menu>
              <Dropdown.Item
                icon="eye"
                text="View details"
                onClick={() => viewRoleClick(row.original.roleId)}
              />
              <Dropdown.Item
                icon="edit"
                text="Role update"
                onClick={() => editRoleClick(row.original.roleId)}
              />
              <Dropdown.Item
                icon="trash"
                text="Remove"
                onClick={(id: any) => singleDelete(row.original.roleId)}
              />
            </Dropdown.Menu>
          </Dropdown>
        </td>)
      )
    },

  ];

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    setLoading(true);
    if (pageSize !== 0 && pageSize !== '') {
      if (pageIndex !== pagination.pageNo) {
        pagination["pageNo"] = pageIndex;
        setPagination(pagination);
      }
      else {
        pagination["pageSize"] = pageSize;
        setPagination(pagination);
        AdminRolelist(pagination)
      }
    } else {
      setGetRoleList([])
    }
    setLoading(false);

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangePageSize = (e: any) => {
    setPagination({ ...pagination, pageSize: e.target.value, pageNo: pagination.pageNo })
  }

  const handleSort = useCallback(sortBy => {
    pagination["sortColumn"] = sortBy.length > 0 ? sortBy[0].id : '';
    pagination["sortOrder"] = sortBy.length > 0 ? sortBy[0].desc ? "desc" : "asc" : ''
    setPagination(pagination);
    setSortState(sortBy)
    AdminRolelist(pagination)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
 
  return (
    <AdminLayout SubTabName="UsersAndRoles">
      <BaseModal
        open={RoleDetailVisible}
        modalType={ModalList.RoleDetail}
        onClose={setRoleDetailModalIsVisible}
        id={selectedRole}
      />
      <BaseModal
        open={RoleCreationVisible}
        modalType={ModalList.RoleUpdate}
        id={selectedRole}
        onClose={setRoleCreationModalIsVisible}
      />
      <GridWrapper className="fixedContent">
    
        <UserAdminTable
          columns={columns}
          data={getRoleList}
          pagination={true}
          fetchData={fetchData}
          pageIndex={pagination.pageNo}
          pageSize={pagination.pageSize}
          onChangePageSize={onChangePageSize}
          totalPages={pagination.totalPages}
          onSort={handleSort}
          initialSortState={sortState ? sortState : []}
          loading={loading}
        />
      </GridWrapper>
    </AdminLayout>
  );
});

export default RoleList;
