import { Area } from '@ant-design/charts'
import React, { useEffect, useState } from 'react'

const DemoArea = () => {
    const [data, setData] = useState([])
    useEffect(() => {
        asyncFetch()
    }, [])
    const asyncFetch = () => {
        fetch(
            'https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json'
        )
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => {
                console.log('fetch data failed', error)
            })
    }
    let config = {
        data: data,
        xField: 'year',
        yField: 'value',
        seriesField: 'category',
        color: [
            '#6897a7',
            '#8bc0d6',
            '#60d7a7',
            '#dedede',
            '#fedca9',
            '#fab36f',
            '#d96d6f',
        ],
        xAxis: {
            type: 'time',
            mask: 'YYYY',
        },
        yAxis: {
            label: {
                formatter: function formatter(v) {
                    return ''
                        .concat(v)
                        .replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
                            return ''.concat(s, ',')
                        })
                },
            },
        },
        legend: { position: 'top' },
    }
    return <Area {...config} style={{ height: '250px', width: '100%' }} />
}

export default DemoArea
