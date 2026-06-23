import { useEffect, useImperativeHandle, useMemo, useState } from 'react'
import type { MutableRefObject, ReactNode } from 'react'
import { Space, Table } from 'antd'
import type { TablePaginationConfig, TableProps } from 'antd'

type RequestResult<RecordType> = {
  data?: RecordType[]
  success?: boolean
  total?: number
  pageSize?: number
  current?: number
}

type ProTableAction = {
  reload: () => void
}

type ProTableProps<RecordType extends object = any> = Omit<TableProps<RecordType>, 'title'> & {
  actionRef?: MutableRefObject<ProTableAction | undefined>
  defaultSize?: TableProps<RecordType>['size']
  headerTitle?: ReactNode
  request?: (
    params: Record<string, any>,
    sorter: Record<string, any>,
    filter: Record<string, any>
  ) => Promise<RequestResult<RecordType>>
  search?: false | Record<string, any>
  toolBarRender?: () => ReactNode[] | ReactNode
}

function ProTable<RecordType extends object = any>(props: ProTableProps<RecordType>) {
  const {
    actionRef,
    dataSource,
    defaultSize,
    headerTitle,
    pagination,
    request,
    size,
    toolBarRender,
    ...tableProps
  } = props
  const [requestData, setRequestData] = useState<RecordType[]>([])
  const [loading, setLoading] = useState(false)
  const [requestPagination, setRequestPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
  })

  const loadData = async (nextPagination: TablePaginationConfig = requestPagination) => {
    if (!request) return

    setLoading(true)
    try {
      const result = await request(
        {
          current: nextPagination.current,
          pageSize: nextPagination.pageSize,
        },
        {},
        {}
      )

      setRequestData(result.data || [])
      setRequestPagination({
        ...nextPagination,
        current: result.current || nextPagination.current,
        pageSize: result.pageSize || nextPagination.pageSize,
        total: result.total,
      })
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(actionRef, () => ({
    reload: () => {
      loadData()
    },
  }))

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toolbar = useMemo(() => {
    if (!headerTitle && !toolBarRender) return undefined

    function renderToolbar() {
      return (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>{headerTitle}</div>
        <Space>{toolBarRender?.()}</Space>
      </div>
      )
    }

    return renderToolbar
  }, [headerTitle, toolBarRender])

  return (
    <Table<RecordType>
      {...tableProps}
      dataSource={request ? requestData : dataSource}
      loading={request ? loading : tableProps.loading}
      pagination={request ? requestPagination : pagination}
      size={size || defaultSize}
      title={toolbar}
      onChange={(nextPagination, filters, sorter, extra) => {
        tableProps.onChange?.(nextPagination, filters, sorter, extra)
        if (request) {
          loadData(nextPagination)
        }
      }}
    />
  )
}

export default ProTable

