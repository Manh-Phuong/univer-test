import ReactECharts from 'echarts-for-react';

interface ChartPreviewProps {
  option: any;
  style?: React.CSSProperties;
}

export const ChartPreview: React.FC<ChartPreviewProps> = ({ option, style }) => {
  return (
    <ReactECharts
      option={option}
      style={{ height: '400px', width: '100%', ...style }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};