import React, { useEffect, useState } from 'react'
import { Card, Table, Tag, Button, Tooltip, Typography, Space, DatePicker, Modal, Descriptions, Image } from 'antd'
import { EyeOutlined, CheckCircleOutlined, MinusCircleOutlined, MedicineBoxOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { medicalEventService } from '../../services/MedicalEventService'
import dayjs, { Dayjs } from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { useLocation, useNavigate } from 'react-router-dom'
import { RangePickerProps } from 'antd/es/date-picker';

const { Title, Text } = Typography

interface EventType {
    id: number
    name: string
    class: string
    event: string
    solution: string
    callParent: string
    createdAt: string
    image?: string | null
}

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

const Event = () => {
    const [events, setEvents] = useState<EventType[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs())
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [detailModal, setDetailModal] = useState<{ open: boolean, event?: EventType }>({ open: false })
    const location = useLocation()
    const navigate = useNavigate()

    function handleShowDetail(event: EventType) {
        setDetailModal({ open: true, event })
    }
    
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const dateParam = params.get('date')
        if (dateParam && dayjs(dateParam, 'YYYY-MM-DD', true).isValid()) {
            setSelectedDate(dayjs(dateParam, 'YYYY-MM-DD'))
            navigate('/guardian/events', { replace: true })
        }
    }, [location.search])

    useEffect(() => {
        let intervalId: number

        const fetchEvents = async () => {
            setLoading(true)
            try {
                const userStr = localStorage.getItem('user')
                const userId = userStr ? JSON.parse(userStr).id : null
                if (!userId) return

                const apiData = await medicalEventService.getMedicalEventsByGuardian(userId)
                const mapped: EventType[] = (apiData || []).map((item: any) => ({
                    id: item.OrtherM_ID,
                    name: item.UserFullname || '',
                    class: item.Medical_record?.Class || '',
                    event: item.Decription,
                    solution: item.Handle,
                    callParent: item.Is_calLOb ? 'Có' : 'Không',
                    createdAt: item.history?.[0]?.Date_create
                        ? item.history[0].Date_create 
                        : '',
                    image: item.Image || null,
                }))
                setEvents(mapped)
            } catch (e) {
                setEvents([])
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
        intervalId = setInterval(fetchEvents, 5000)

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    const filteredEvents = dateRange && dateRange[0] && dateRange[1]
        ? events.filter(ev =>
            ev.createdAt &&
            dayjs(ev.createdAt).isSameOrAfter(dateRange[0], 'day') &&
            dayjs(ev.createdAt).isSameOrBefore(dateRange[1], 'day')
        )
        : selectedDate
            ? events.filter(ev =>
                ev.createdAt && dayjs(ev.createdAt).isSame(selectedDate, 'day')
            )
            : events

    const columns: ColumnsType<EventType> = [
        {
            title: 'STT',
            key: 'stt',
            align: 'center',
            render: (_: any, __: any, idx: number) => idx + 1,
        },
        {
            title: 'TÊN HỌC SINH',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: 'LỚP',
            dataIndex: 'class',
            key: 'class',
            align: 'center',
        },
        {
            title: 'SỰ KIỆN Y TẾ',
            dataIndex: 'event',
            key: 'event',
            align: 'center',
        },
        {
            title: 'BIỆN PHÁP XỬ LÝ',
            dataIndex: 'solution',
            key: 'solution',
            align: 'center',
        },
        {
            title: 'GỌI BỐ MẸ',
            dataIndex: 'callParent',
            key: 'callParent',
            align: 'center',
            render: (val: string) =>
                val === 'Có' ? (
                    <Tag color="green" icon={<CheckCircleOutlined />}>Đã gọi</Tag>
                ) : (
                    <Tag color="default" icon={<MinusCircleOutlined />}>Chưa gọi</Tag>
                ),
        },
        {
            title: 'NGÀY TẠO',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
        },
        {
            title: 'HÀNH ĐỘNG',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button type="text" icon={<EyeOutlined />} onClick={() => handleShowDetail(record)} />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    return (
        <div style={{ padding: 24, background: '#f5f6fa', minHeight: '80vh' }}>
            <Card>
                <Title level={2} style={{ margin: 0 }}> <MedicineBoxOutlined /> Sự kiện y tế</Title>
                <Text type="secondary">Theo dõi các sự kiện y tế của học sinh.</Text>
            </Card>
            <Card style={{ marginTop: 24 }}>
                <Space style={{ marginBottom: 16 }}>
                    <DatePicker
                        format="DD/MM/YYYY"
                        placeholder={dayjs().format('DD/MM/YYYY')}
                        value={selectedDate}
                        onChange={date => {
                            setSelectedDate(date)
                            setDateRange(null)
                            if (location.search.includes('date=')) {
                                navigate('/guardian/event')
                            }
                        }}
                        allowClear
                    />
                    <DatePicker.RangePicker
                        format="DD/MM/YYYY"
                        value={dateRange}
                        onChange={range => {
                            setDateRange(range)
                            setSelectedDate(null)
                        }}
                        allowClear
                        placeholder={['Từ ngày', 'Đến ngày']}
                    />
                </Space>
                <Table
                    columns={columns}
                    dataSource={filteredEvents.map(ev => ({
                        ...ev,
                        createdAt: ev.createdAt ? dayjs(ev.createdAt).format('DD/MM/YYYY') : '',
                    }))}
                    rowKey="id"
                    loading={loading}
                    pagination={{ position: ['bottomRight'], pageSize: 5 }}
                    bordered
                />
            </Card>

            <Modal
                open={detailModal.open}
                title="Chi tiết sự kiện y tế"
                onCancel={() => setDetailModal({ open: false })}
                footer={null}
                centered
            >
                {detailModal.event && (
                    <Descriptions column={1} bordered size="middle">
                        <Descriptions.Item label="Tên học sinh">{detailModal.event.name}</Descriptions.Item>
                        <Descriptions.Item label="Lớp">{detailModal.event.class}</Descriptions.Item>
                        <Descriptions.Item label="Sự kiện y tế">{detailModal.event.event}</Descriptions.Item>
                        <Descriptions.Item label="Biện pháp xử lý">{detailModal.event.solution}</Descriptions.Item>
                        <Descriptions.Item label="Gọi bố mẹ">{detailModal.event.callParent}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {detailModal.event.createdAt
                                ? dayjs(detailModal.event.createdAt).isValid()
                                    ? dayjs(detailModal.event.createdAt).format('DD/MM/YYYY')
                                    : detailModal.event.createdAt
                                : ''}
                        </Descriptions.Item>
                        {detailModal.event.image && (
                            <Descriptions.Item label="Hình ảnh">
                                <Image src={detailModal.event.image} alt="event" width={200} />
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                )}
            </Modal>
        </div>
    )
}

export default Event