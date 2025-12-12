import style from './ProgressCircle.module.css';

interface ProgressCircleProps {
    percent?: number;
    color?: string;
    title?: string;
    size?: number;
    strokeWidth?: number;
}

function ProgressCircle({
    percent = 84,
    color = '#00ba00',
    title = "completed",
    size = 180,
    strokeWidth = 10
}: ProgressCircleProps) {

    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        // Container chính: Dùng Flex để xếp dọc
        <div className={style['progress-container']}>

            {/* Khối chứa Vòng tròn + Số % */}
            <div
                className={style['circle-box']}
                style={{ width: size, height: size }}
            >
                <svg width={size} height={size}>
                    <circle
                        cx={center} cy={center} r={radius}
                        strokeWidth={strokeWidth}
                        className={style.bg}
                    ></circle>
                    <circle
                        cx={center} cy={center} r={radius}
                        strokeWidth={strokeWidth}
                        className={style.progress}
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: offset,
                            stroke: color
                        }}
                    ></circle>
                </svg>

                {/* Số % nằm GIỮA vòng tròn */}
                <div className={style.text} style={{ fontSize: size * 0.2 }}>
                    {percent}%
                </div>
            </div>

            {/* Tiêu đề nằm DƯỚI chân vòng tròn */}
            <div className={style.progressTitle} >
                <span
                    style={{
                        width: 10,
                        height: 10,
                        backgroundColor: color,
                        borderRadius: '50%',
                        marginRight: 8,
                        display: 'inline-block',
                        color
                    }}
                ></span>
                {title}
            </div>
        </div>
    );
}

export default ProgressCircle;