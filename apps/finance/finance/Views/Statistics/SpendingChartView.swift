import SwiftUI

struct SpendingChartView: View {
    let months: [MonthlySpending]
    @Binding var selectedMonth: MonthlySpending?

    private var maxTotal: Double {
        months.map { $0.total }.max() ?? 1
    }

    var body: some View {
        VStack(spacing: 8) {
            // Bar chart
            HStack(alignment: .bottom, spacing: 12) {
                ForEach(months) { month in
                    VStack(spacing: 4) {
                        // Amount label
                        Text(formatAmount(month.total))
                            .font(.caption2)
                            .foregroundColor(.secondary)
                            .lineLimit(1)
                            .minimumScaleFactor(0.5)

                        // Spacer pushes bar to bottom
                        Spacer(minLength: 0)

                        // Bar grows upward from bottom
                        RoundedRectangle(cornerRadius: 4)
                            .fill(barColor(for: month))
                            .frame(height: barHeight(for: month))
                            .frame(maxWidth: .infinity)
                            .onTapGesture {
                                withAnimation {
                                    selectedMonth = selectedMonth?.id == month.id ? nil : month
                                }
                            }

                        // Month label
                        Text(shortMonthLabel(month))
                            .font(.caption)
                            .foregroundColor(.primary)
                    }
                    .frame(maxWidth: .infinity)
                }
            }
            .frame(height: 180)
            .padding(.horizontal)

            // Selected month breakdown
            if let selected = selectedMonth {
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text(selected.monthLabel)
                            .font(.headline)
                        Spacer()
                        Text(formatAmount(selected.total))
                            .font(.headline)
                    }

                    Divider()

                    ForEach(selected.categoryBreakdown) { category in
                        HStack {
                            Text(category.categoryName)
                            Spacer()
                            Text("\(category.percentage)%")
                                .foregroundColor(.secondary)
                            Text(formatAmount(category.amount))
                        }
                        .font(.subheadline)
                    }
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(12)
                .padding(.horizontal)
            }
        }
    }

    private func barHeight(for month: MonthlySpending) -> CGFloat {
        guard maxTotal > 0 else { return 0 }
        let proportion = month.total / maxTotal
        return max(CGFloat(proportion) * 120, month.total > 0 ? 4 : 0)
    }

    private func barColor(for month: MonthlySpending) -> Color {
        if selectedMonth?.id == month.id {
            return .blue
        }
        return .blue.opacity(0.7)
    }

    private func shortMonthLabel(_ month: MonthlySpending) -> String {
        // Extract short month name from "January 2026" -> "Jan"
        let components = month.monthLabel.split(separator: " ")
        if let monthName = components.first {
            return String(monthName.prefix(3))
        }
        return month.month
    }

    private func formatAmount(_ amount: Double) -> String {
        if amount >= 1000 {
            return String(format: "%.1fK", amount / 1000)
        }
        return String(format: "%.0f", amount)
    }
}
