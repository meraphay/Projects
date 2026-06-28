// ============================================================
// Module : mod999_counter (Tally Counter)
// Function: Counts 0 to 998, wraps to 0, holds when cnt=0
// Method  : SMD (Sequential + Combinational separate always)
// Reset   : Asynchronous, Active High
// ============================================================

module mod999_counter (
    input  wire        clk,
    input  wire        rst,    // async reset, active high
    input  wire        cnt,    // count enable (pulse from top_button)
    output reg  [9:0]  count   // 10-bit output (0-998)
);

    // ---- Internal Registers ----
    reg [9:0] c_count, n_count;

    // ============================================================
    // CSL - Current State Logic (Sequential)
    // ============================================================
    always @(posedge clk or posedge rst) begin
        if (rst)
            c_count <= 10'd0;
        else
            c_count <= n_count;
    end

    // ============================================================
    // NSL + OPL - Next State & Output Logic (Combinational)
    // ============================================================
    always @(*) begin
        // default: hold
        n_count = c_count;

        if (cnt) begin
            if (c_count == 10'd998)
                n_count = 10'd0;   // wrap around
            else
                n_count = c_count + 10'd1;
        end
    end

    // ---- Output Assignment ----
    always @(*) begin
        count = c_count;
    end

endmodule
