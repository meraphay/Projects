// ============================================================
// Module : Top_dispSel
// Function: 4-digit 7-segment display multiplexer
//           Selects one BCD digit at a time using digit_sel
//           Drives corresponding anode LOW
//           blank_phase inserts blanking between digit switches
// Method  : SMD (CSL + NSL + OPL strictly separated)
// Reset   : Asynchronous, Active High
// ============================================================

module Top_dispSel(
    input  wire        clk,
    input  wire        rst,
    input  wire [3:0]  bcd0,
    input  wire [3:0]  bcd1,
    input  wire [3:0]  bcd2,
    input  wire [3:0]  bcd3,
    output reg  [3:0]  bcd_disp,
    output reg  [3:0]  seg_sel_out
);

    // ---- Internal wires and registers ----
    wire        pulse_500hz;

    // Current state registers
    reg [1:0]   c_digit_sel,   n_digit_sel;
    reg         c_blank_phase, n_blank_phase;
    reg [3:0]   c_seg_sel_out, n_seg_sel_out;
    reg [3:0]   c_bcd_disp,    n_bcd_disp;

    // ---- Instantiate pulse_50hz ----
    pulse_50hz RefClk(
        .clk   (clk),
        .rst   (rst),
        .pulse (pulse_500hz)
    );

    // ============================================================
    // CSL - Current State Logic (Sequential)
    // ============================================================
    always @(posedge clk or posedge rst) begin
        if (rst) begin
            c_digit_sel   <= 2'b00;
            c_blank_phase <= 1'b0;
            c_seg_sel_out <= 4'b1111;
            c_bcd_disp    <= 4'd0;
        end
        else begin
            c_digit_sel   <= n_digit_sel;
            c_blank_phase <= n_blank_phase;
            c_seg_sel_out <= n_seg_sel_out;
            c_bcd_disp    <= n_bcd_disp;
        end
    end

    // ============================================================
    // NSL - Next State Logic (Combinational)
    // ============================================================
    always @(*) begin
        // defaults - hold current state
        n_digit_sel   = c_digit_sel;
        n_blank_phase = c_blank_phase;
        n_seg_sel_out = c_seg_sel_out;
        n_bcd_disp    = c_bcd_disp;

        if (pulse_500hz) begin
            if (!c_blank_phase) begin
                // blanking phase - turn all anodes off
                n_seg_sel_out = 4'b1111;
                n_blank_phase = 1'b1;
            end
            else begin
                // display phase - select digit
                case (c_digit_sel)
                    2'b00: begin
                        n_bcd_disp    = 4'd0;
                        n_seg_sel_out = 4'b1111; // leftmost OFF
                    end
                    2'b01: begin
                        n_bcd_disp    = bcd2;
                        n_seg_sel_out = 4'b1011; // AN2
                    end
                    2'b10: begin
                        n_bcd_disp    = bcd1;
                        n_seg_sel_out = 4'b1101; // AN1
                    end
                    2'b11: begin
                        n_bcd_disp    = bcd0;
                        n_seg_sel_out = 4'b1110; // AN0 rightmost
                    end
                    default: begin
                        n_bcd_disp    = 4'd0;
                        n_seg_sel_out = 4'b1111;
                    end
                endcase

                n_digit_sel   = c_digit_sel + 2'b01;
                n_blank_phase = 1'b0;
            end
        end
    end

    // ============================================================
    // OPL - Output Logic (Combinational)
    // ============================================================
    always @(*) begin
        bcd_disp    = c_bcd_disp;
        seg_sel_out = c_seg_sel_out;
    end

endmodule
