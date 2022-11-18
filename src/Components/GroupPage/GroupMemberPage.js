import React from 'react';
import "antd/dist/antd.min.css";
import { Button, Form, Input, Popconfirm, Table, Dropdown } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useContext, useEffect, useRef, useState } from 'react';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const items = [
    {
        key: '1',
        label: 'Action 1',
    },
    {
        key: '2',
        label: 'Action 2',
    },
];
const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};
export const GroupMemberPage = (memberPayload) => {
    const [dataSource, setDataSource] = useState(
        
        [
        {
            key: '0',
            name: 'Edward King 0',
            role: 'Owner',
            address: 'London, Park Lane no. 0',
        },
        {
            key: '1',
            name: 'Edward King 1',
            role: 'Member',
            address: 'London, Park Lane no. 1',
        },
    ]
    
    );
    const [count, setCount] = useState(2);
    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };
    const defaultColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '30%',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
        {
            title: 'address',
            dataIndex: 'address',
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        {record.role == "Owner" ? <a></a> : <a>Delete</a>}
                    </Popconfirm>
                ) : null,
        },
        // {
        //     title: 'operation',
        //     dataIndex: 'operation',
        //     render: () => (
        //         <Dropdown
        //             menu={{
        //                 items,
        //             }}
        //         >
        //             <a>
        //                 More <DownOutlined />
        //             </a>
        //         </Dropdown>
        //     )
        // },
    ];
    const handleAdd = () => {
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            role: 'owner',
            address: `London, Park Lane no. ${count}`,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };
    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });
    return (
        <div>
            <Button onClick={handleAdd} type="primary" shape="round" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>Add member</Button>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
            />
        </div>
    );
};
export default GroupMemberPage;