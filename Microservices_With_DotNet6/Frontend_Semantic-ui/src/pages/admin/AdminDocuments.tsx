
// import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
import { Dropdown, Grid, GridColumn } from "semantic-ui-react";

import Icon from "../../components/elements/Icon";
import { IconEnum as Icons } from "../../components/elements/Icons";
// import colors from '../../util/Colors';
import { CheckBox, DocIcon, FLexBox, GridWrapper, TableContent, WhiteCheckBox } from "./WithAdminLayout";


const subType = [
    { key: 'Deal flow', value: 'Deal flow', text: 'Deal flow' },
    { key: 'Deal flow 1', value: 'Deal flow 1', text: 'Deal flow 1' },
    { key: 'Deal flow 2', value: 'Deal flow 2', text: 'Deal flow 2' },
    { key: 'Deal flow 3', value: 'Deal flow 3', text: 'Deal flow 3' },
    { key: 'Deal flow 4', value: 'Deal flow 4', text: 'Deal flow 4' },
]


const AdminDocuments = () => {

return (
        <>
            <GridWrapper>
                <Grid columns={3}>
                    <GridColumn width={4} className="fullWidth">
                        <label>Module</label>
                        <Dropdown fluid selection options={subType} placeholder='Deal flow'  />
                    </GridColumn>                 
                </Grid>  
                <div className="fixedContent4">
                    <TableContent>
                        <table cellSpacing="0" cellPadding="0">
                            <thead>
                                <tr>
                                    <th>Display Name</th>
                                    <th className="modifiedCol smHide">Modified</th>
                                    <th className="fixWidth">
                                        <FLexBox>
                                            <WhiteCheckBox>
                                                <input type="checkbox"></input>
                                                <span className="checkmark"></span>
                                            </WhiteCheckBox> 
                                            <Icon icon={Icons.DownArrow}/>
                                        </FLexBox>                                    
                                    </th>
                                    <th><Icon icon={Icons.Delete}/></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <article>
                                            <DocIcon>
                                                <span className="secondaryColor"><Icon  icon={Icons.PlusIcon}/></span>
                                                <span className="primeryColor"><Icon icon={Icons.FolderIcon}/></span>
                                            </DocIcon>                                    
                                            Financial
                                        </article>
                                    </td>                                
                                    <td className="modifiedCol smHide">11 Month ago</td>                             
                                    <td className="fixWidth">
                                        <CheckBox>
                                            <input type="checkbox"></input>   
                                            <span className="checkmark"></span>     
                                        </CheckBox> 
                                    </td>
                                    <td className="fixWidth">
                                        <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>
                                            <Dropdown.Menu>
                                                <Dropdown.Item icon='eye' text='View details'/>
                                                <Dropdown.Item icon='folder' text='Create folder'/>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>                                
                                </tr> 
                                <tr>
                                    <td>
                                        <article className="indentCol">
                                            <DocIcon>
                                                <span className="secondaryColor"><Icon  icon={Icons.PlusIcon}/></span>
                                                <span className="primeryColor"><img src={Icons.folerIcon}alt=""></img></span>
                                            </DocIcon>                                    
                                            Balance sheet
                                        </article>
                                    </td>                                
                                    <td className="modifiedCol smHide">11 Month ago</td>                             
                                    <td className="fixWidth">
                                        <CheckBox>
                                            <input type="checkbox"></input>   
                                            <span className="checkmark"></span>     
                                        </CheckBox> 
                                    </td>
                                    <td className="fixWidth">
                                        <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>
                                            <Dropdown.Menu>
                                                <Dropdown.Item icon='eye' text='View details'/>
                                                <Dropdown.Item icon='folder' text='Create folder'/>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>                                
                                </tr> 
                                
                                <tr>
                                    <td>
                                        <article className="indentCol">
                                            <DocIcon>
                                                <span className="secondaryColor"><Icon  icon={Icons.PlusIcon}/></span>
                                                <span className="primeryColor"><img src={Icons.folerIcon}alt=""></img></span>
                                            </DocIcon>                                    
                                            P&L
                                        </article>
                                    </td>                                
                                    <td className="modifiedCol smHide">11 Month ago</td>                             
                                    <td className="fixWidth">
                                        <CheckBox>
                                            <input type="checkbox"></input>   
                                            <span className="checkmark"></span>     
                                        </CheckBox> 
                                    </td>
                                    <td className="fixWidth">
                                        <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>
                                            <Dropdown.Menu>
                                                <Dropdown.Item icon='eye' text='View details'/>
                                                <Dropdown.Item icon='folder' text='Create folder'/>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>                                
                                </tr> 
                                <tr>
                                    <td>
                                        <article className="indentCol">
                                            <DocIcon>
                                                <span className="secondaryColor"><Icon  icon={Icons.PlusIcon}/></span>
                                                <span className="primeryColor"><img src={Icons.folerIcon}alt=""></img></span>
                                            </DocIcon>                                    
                                            Budget
                                        </article>
                                    </td>                                
                                    <td className="modifiedCol smHide">11 Month ago</td>                             
                                    <td className="fixWidth">
                                        <CheckBox>
                                            <input type="checkbox"></input>   
                                            <span className="checkmark"></span>     
                                        </CheckBox> 
                                    </td>
                                    <td className="fixWidth">
                                        <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>
                                            <Dropdown.Menu>
                                                <Dropdown.Item icon='eye' text='View details'/>
                                                <Dropdown.Item icon='folder' text='Create folder'/>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>                                
                                </tr>
                                <tr>
                                    <td>
                                        <article>
                                            <DocIcon>
                                                <span className="secondaryColor"><Icon  icon={Icons.PlusIcon}/></span>
                                                <span className="primeryColor"><Icon icon={Icons.FolderIcon}/></span>
                                            </DocIcon>                                    
                                            Legal
                                        </article>
                                    </td>                                
                                    <td className="modifiedCol smHide">11 Month ago</td>                             
                                    <td className="fixWidth">
                                        <CheckBox>
                                            <input type="checkbox"></input>   
                                            <span className="checkmark"></span>     
                                        </CheckBox> 
                                    </td>
                                    <td className="fixWidth">
                                        <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>
                                            <Dropdown.Menu>
                                                <Dropdown.Item icon='eye' text='View details'/>
                                                <Dropdown.Item icon='folder' text='Create folder'/>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>                                
                                </tr>  
                                
                                <tr>
                                    <td>
                                        <article>
                                            <DocIcon>
                                                <span className="secondaryColor"><Icon  icon={Icons.PlusIcon}/></span>
                                                <span className="primeryColor"><Icon icon={Icons.FolderIcon}/></span>
                                            </DocIcon>                                    
                                            Commercial
                                        </article>
                                    </td>                                
                                    <td className="modifiedCol smHide">11 Month ago</td>                             
                                    <td className="fixWidth">
                                        <CheckBox>
                                            <input type="checkbox"></input>   
                                            <span className="checkmark"></span>     
                                        </CheckBox> 
                                    </td>
                                    <td className="fixWidth">
                                        <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>
                                            <Dropdown.Menu>
                                                <Dropdown.Item icon='eye' text='View details'/>
                                                <Dropdown.Item icon='folder' text='Create folder'/>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>                                
                                </tr>  
                                
                                <tr>
                                    <td>
                                        <article>
                                            <DocIcon>
                                                <span className="secondaryColor"><Icon  icon={Icons.PlusIcon}/></span>
                                                <span className="primeryColor"><Icon icon={Icons.FolderIcon}/></span>
                                            </DocIcon>                                    
                                            ESG
                                        </article>
                                    </td>                                
                                    <td className="modifiedCol smHide">11 Month ago</td>                             
                                    <td className="fixWidth">
                                        <CheckBox>
                                            <input type="checkbox"></input>   
                                            <span className="checkmark"></span>     
                                        </CheckBox> 
                                    </td>
                                    <td className="fixWidth">
                                        <Dropdown icon='ellipsis vertical' className='icon ellipseDropDown'>
                                            <Dropdown.Menu>
                                                <Dropdown.Item icon='eye' text='View details'/>
                                                <Dropdown.Item icon='folder' text='Create folder'/>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>                                
                                </tr>                      
                            </tbody>                        
                        </table>
                    </TableContent>
                </div>
            </GridWrapper>
            
               
        </>
    );
};

export default AdminDocuments;


