import SwiftUI

struct StatisticsView: View {
    @StateObject private var statisticsService = StatisticsService()
    @State private var selectedMonth: MonthlySpending?

    var body: some View {
        Group {
            if statisticsService.isLoading {
                ProgressView("Loading statistics...")
            } else if let error = statisticsService.error {
                ContentUnavailableView(
                    "Error Loading Statistics",
                    systemImage: "exclamationmark.triangle",
                    description: Text(error)
                )
            } else if let summary = statisticsService.summary {
                ScrollView {
                    VStack(spacing: 24) {
                        // Overall trend header
                        HStack {
                            VStack(alignment: .leading) {
                                Text("Spending Trend")
                                    .font(.headline)
                                Text("Last 5 Months")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }

                            Spacer()

                            TrendIndicatorView(trend: summary.trends.overallTrend, showLabel: true)
                        }
                        .padding(.horizontal)

                        // 5-month bar chart
                        SpendingChartView(
                            months: summary.months,
                            selectedMonth: $selectedMonth
                        )

                        // Month comparison
                        MonthComparisonView(comparison: summary.comparison)
                            .padding(.horizontal)

                        // Category trends (if not showing month breakdown)
                        if selectedMonth == nil && !summary.trends.categoryTrends.isEmpty {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Category Trends")
                                    .font(.headline)
                                    .padding(.horizontal)

                                VStack(spacing: 8) {
                                    ForEach(summary.trends.categoryTrends) { trend in
                                        HStack {
                                            TrendIndicatorView(trend: trend.trendDirection)

                                            Text(trend.categoryName)

                                            Spacer()

                                            VStack(alignment: .trailing) {
                                                Text(formatAmount(trend.currentMonth))
                                                    .fontWeight(.medium)
                                                Text("avg \(formatAmount(trend.averageMonthly))")
                                                    .font(.caption)
                                                    .foregroundColor(.secondary)
                                            }
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
                    .padding(.vertical)
                }
            } else {
                ContentUnavailableView(
                    "No Statistics",
                    systemImage: "chart.bar",
                    description: Text("Statistics will appear once you have transactions")
                )
            }
        }
        .navigationTitle("Statistics")
        .refreshable {
            await statisticsService.fetchSpendingSummary()
        }
        .task {
            await statisticsService.fetchSpendingSummary()
        }
    }

    private func formatAmount(_ amount: Double) -> String {
        String(format: "%.0f", amount)
    }
}

#Preview {
    NavigationStack {
        StatisticsView()
    }
}
