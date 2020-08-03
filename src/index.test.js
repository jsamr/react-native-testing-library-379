import React, {
  forwardRef,
  useImperativeHandle,
  PureComponent,
  createRef,
} from "react";
import { useState } from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

const Dummy = forwardRef(function Dummy(props, ref) {
  const [loadCycleId, setLoadCycleId] = useState(0);
  useImperativeHandle(
    ref,
    () => ({
      reload() {
        setLoadCycleId(loadCycleId + 1);
      },
    }),
    [loadCycleId]
  );
  return <Text testID={`load-cycle-${loadCycleId}`} {...props}>{loadCycleId}</Text>
});

class Owner extends PureComponent {
  dummyRef = createRef();

  reload() {
    this.dummyRef.current?.reload();
  }

  render() {
    return <Dummy ref={this.dummyRef} />
  }
}

describe("Owner component", () => {
  it("should not trow errors in the console", async () => {
    const { findByTestId, UNSAFE_getByType } = render(<Owner />);
    const result = UNSAFE_getByType(Owner);
    expect(result.instance.reload).toBeTruthy();
    await findByTestId("load-cycle-0");
    result.instance.reload();
    await findByTestId("load-cycle-1");
  });
});
