import React, { ReactNode, useState, useEffect } from "react";
import { View, PanResponder, StyleSheet } from "react-native";

interface Props {
    pixelSize: number;
    cellClicked(
        startX: number,
        startY: number,
        width: number,
        height: number
    ): void;
}

export default (props: React.PropsWithChildren<Props>) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [rows, setRows] = useState(0);
    const [columns, setColumns] = useState(0);
    const [offset, setOffset] = useState(0);
    const [pixBoardTop, setPixBoardTop] = useState(0);
    const [pixBoardLeft, setPixBoardLeft] = useState(0);

    let cells: Array<ReactNode> = [];
    let paths: Array<string> = [];

    const onTouch = (event, gestureState) => {
        paths = [];

        const x: float = gestureState.x0 - pixBoardLeft;
        const y: float = gestureState.y0 - pixBoardTop;

        const col: float = Math.floor(x / props.pixelSize);
        const row: float = Math.floor(y / props.pixelSize);

        const path: string = `${col},${row}`;

        // Check not already coloured in
        if (paths.indexOf(path) > -1) {
            return;
        }

        paths.push(path);

        props.cellClicked(
            col * props.pixelSize,
            row * props.pixelSize,
            props.pixelSize,
            props.pixelSize
        );

        console.log(`${col} ${row}`);
    };

    const onMove = (event, gestureState) => {
        const x: float = gestureState.moveX - pixBoardLeft;
        const y: float = gestureState.moveY - pixBoardTop;

        const col: float = Math.floor(x / props.pixelSize);
        const row: float = Math.floor(y / props.pixelSize);

        const path: string = `${col},${row}`;

        // Check not already coloured in
        if (paths.indexOf(path) > -1) {
            return;
        }

        paths.push(path);

        props.cellClicked(
            col * props.pixelSize,
            row * props.pixelSize,
            props.pixelSize,
            props.pixelSize
        );

        console.log(`${col} ${row}`);
    };

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const top: number = row * props.pixelSize;
            const left: number = col * props.pixelSize;

            cells.push(
                <View
                    key={`${row}-${col}`}
                    style={[
                        Style.pixel,
                        {
                            top: top,
                            left: left,
                            width: props.pixelSize,
                            height: props.pixelSize,
                        },
                    ]}
                />
            );
        }
    }

    useEffect(() => {
        this.pixelBoard.measure((fx, fy, width, height, px, py) => {
            setPixBoardLeft(px);
            setPixBoardTop(py);
        });
    });

    this.panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (event, gestureState) => true,
        onStartShouldSetPanResponderCapture: (event, gestureState) => true,
        onMoveShouldSetPanResponder: (event, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (event, gestureState) => true,
        onShouldBlockNativeResponder: (event, gestureState) => true,
        onPanResponderGrant: (event, gestureState) => {
            onTouch(event, gestureState);
        },
        onPanResponderMove: (event, gestureState) => {
            onMove(event, gestureState);
        },
    });

    return (
        <View
            style={Style.container}
            onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                const rows: number = Math.floor(height / props.pixelSize);
                const columns: number = Math.floor(width / props.pixelSize);
                const offset: number = (width % props.pixelSize) / 2;

                setWidth(width);
                setHeight(height);
                setColumns(columns);
                setRows(rows);
                setOffset(offset);
            }}
        >
            <View
                ref={(view) => {
                    this.pixelBoard = view;
                }}
                style={[
                    Style.pixelBoard,
                    {
                        left: offset,
                        width: columns * props.pixelSize,
                        height: rows * props.pixelSize,
                    },
                ]}
                {...this.panResponder.panHandlers}
            >
                {props.children}
                {cells}
            </View>
        </View>
    );
};

const Style = StyleSheet.create({
    container: {
        flex: 1,
    },
    pixelBoard: {
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "red",
    },
    pixel: {
        position: "absolute",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "grey",
    },
});
