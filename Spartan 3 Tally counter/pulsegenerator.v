// ============================================================
// Module : pulse_500hz
// Function: Generates 1-clock-cycle pulse every 0.5ms
//           From 50MHz clock: 50,000,000 / 2000 = 25,000 cycles
//           Used for fast 4-digit seven-segment multiplexing
// Method  : SMD
// Reset   : Asynchronous, Active High
// ============================================================

module pulse_50hz (
    input  wire clk,
    input  wire rst,
    output reg  pulse
);

    // 25,000 cycles = 0.5ms at 50MHz
    localparam COUNT_MAX = 20'd24999;

    reg [19:0] c_count, n_count;
    reg        n_pulse;

    // CSL
    always @(posedge clk or posedge rst) begin
        if (rst) begin
            c_count <= 20'd0;
            pulse   <= 1'b0;
        end
        else begin
            c_count <= n_count;
            pulse   <= n_pulse;
        end
    end

    // NSL + OPL
    always @(*) begin
        n_count = c_count + 20'd1;
        n_pulse = 1'b0;

        if (c_count == COUNT_MAX) begin
            n_count = 20'd0;
            n_pulse = 1'b1;
        end
    end

endmodule