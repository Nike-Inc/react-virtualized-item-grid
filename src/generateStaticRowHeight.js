// @flow

function generateRowHeightWithoutHeaderOrFooter(getRowHeight: (input: { index: number }) => number) {
  return getRowHeight({ index: 0 });
}

function generateRowHeightWithHeader(getRowHeight: (input: { index: number }) => number) {
  const headerHeight = getRowHeight({ index: 0 });
  const staticRowHeight = getRowHeight({ index: 1 });
  return ({ index }: { index: number }) => { // eslint-disable-line
    if (index === 0) {
      return headerHeight;
    }
    return staticRowHeight;
  };
}

function generateRowHeightWithFooter(getRowHeight: (input: { index: number }) => number, rowCount: number) {
  const staticRowHeight = getRowHeight({ index: 0 });
  const footerHeight = getRowHeight({ index: rowCount });
  return ({ index }: { index: number }) => { // eslint-disable-line
    if (index === rowCount) {
      return footerHeight;
    }
    return staticRowHeight;
  };
}

function generateRowHeightWithHeaderAndFooter(getRowHeight: (input: { index: number }) => number, rowCount: number) {
  const headerHeight = getRowHeight({ index: 0 });
  const staticRowHeight = getRowHeight({ index: 1 });
  const footerRowIndex = rowCount + 1;
  const footerHeight = getRowHeight({ index: footerRowIndex });
  return ({ index }: { index: number }) => { // eslint-disable-line
    if (index === 0) {
      return headerHeight;
    }
    if (index === footerRowIndex) {
      return footerHeight;
    }
    return staticRowHeight;
  };
}

export default function generateStaticRowHeight(
  getRowHeight: (input: { index: number }) => number,
  rowCount: number,
  hasHeader: boolean,
  hasFooter: boolean
) {
  if (hasHeader) {
    if (hasFooter) {
      return generateRowHeightWithHeaderAndFooter(getRowHeight, rowCount);
    }
    return generateRowHeightWithHeader(getRowHeight);
  }
  if (hasFooter) {
    return generateRowHeightWithFooter(getRowHeight, rowCount);
  }
  return generateRowHeightWithoutHeaderOrFooter(getRowHeight);
}
