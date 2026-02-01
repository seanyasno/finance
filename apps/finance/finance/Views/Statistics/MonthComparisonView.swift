import SwiftUI

struct MonthComparisonView: View {
    let comparison: MonthComparison

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Overall comparison header
            HStack {
                VStack(alignment: .leading) {
                    Text("vs Previous Month")
                        .font(.subheadline)
                        .foregroundColor(.secondary)

                    if let changePercent = comparison.changePercent,
                       let changeAmount = comparison.changeAmount {
                        HStack(spacing: 8) {
                            TrendIndicatorView(trend: comparison.trendDirection)

                            Text(formatChange(changeAmount, percent: changePercent))
                                .font(.title2)
                                .fontWeight(.semibold)
                                .foregroundColor(changeColor)
                        }
                    } else {
                        Text("No previous data")
                            .font(.title3)
                            .foregroundColor(.secondary)
                    }
                }

                Spacer()

                VStack(alignment: .trailing) {
                    Text("This Month")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text(formatAmount(comparison.currentTotal))
                        .font(.title3)
                        .fontWeight(.medium)
                }
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)

            // Category comparisons
            if !comparison.categoryComparisons.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("By Category")
                        .font(.headline)

                    ForEach(comparison.categoryComparisons) { category in
                        HStack {
                            TrendIndicatorView(trend: category.trendDirection)

                            Text(category.categoryName)

                            Spacer()

                            if let changePercent = category.changePercent {
                                Text("\(changePercent > 0 ? "+" : "")\(changePercent)%")
                                    .font(.caption)
                                    .foregroundColor(categoryChangeColor(category.trendDirection))
                            }

                            Text(formatAmount(category.currentAmount))
                                .fontWeight(.medium)
                        }
                        .font(.subheadline)
                    }
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(12)
            }
        }
    }

    private var changeColor: Color {
        switch comparison.trend {
        case .up: return .red
        case .down: return .green
        case .stable: return .secondary
        }
    }

    private func categoryChangeColor(_ trend: TrendDirection) -> Color {
        switch trend {
        case .up: return .red
        case .down: return .green
        case .stable: return .secondary
        }
    }

    private func formatChange(_ amount: Double, percent: Double) -> String {
        let sign = amount >= 0 ? "+" : ""
        return "\(sign)\(formatAmount(amount)) (\(sign)\(Int(percent))%)"
    }

    private func formatAmount(_ amount: Double) -> String {
        String(format: "%.0f", abs(amount))
    }
}
