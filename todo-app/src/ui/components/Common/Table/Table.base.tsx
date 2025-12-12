
interface Column {
    key: string;
    label: string;
}

interface TableBaseProps {
    columns?: Column[];
    data?: any[];
    footer?: any[];
}

export default function TableBase() {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th></th>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}