import SwiftUI

struct TrendIndicatorView: View {
    let trend: TrendDirection
    let showLabel: Bool

    init(trend: TrendDirection, showLabel: Bool = false) {
        self.trend = trend
        self.showLabel = showLabel
    }

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: iconName)
                .foregroundColor(color)
            if showLabel {
                Text(label)
                    .font(.caption)
                    .foregroundColor(color)
            }
        }
    }

    private var iconName: String {
        switch trend {
        case .up: return "arrow.up"
        case .down: return "arrow.down"
        case .stable: return "arrow.forward"
        }
    }

    private var color: Color {
        switch trend {
        // Red for spending increase (bad), green for decrease (good)
        case .up: return .red
        case .down: return .green
        case .stable: return .secondary
        }
    }

    private var label: String {
        switch trend {
        case .up: return "Increasing"
        case .down: return "Decreasing"
        case .stable: return "Stable"
        }
    }
}
