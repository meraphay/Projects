// ============================================================
// Module : Top_Tally_Counter
// Function: Top-level wrapper for Tally Counter system
//           Spartan-3 Starter Kit Board
// Inputs  : clk (T9), rst (L14/BTN3), btn (M14/BTN1)
// Outputs : seg7_out (7-bit), seg_sel_out (4-bit)
// Method  : SMD structural top module
//           Internal sequential logic follows strict SMD
// ============================================================
//
// Hierarchy:
//   Top_Tally_Counter
//   ├── top_button        (btn debounce + sync + level2pulse)
//   │   ├── synchronizer
//   │   ├── top_debounce
//   │   │   ├── sm_debounce
//   │   │   └── counter_20ms
//   │   └── lev_puls_conv
//   ├── mod999_counter    (Tally Counter 0-998)
//   ├── moore_fsm         (MyFSM - generates start for bin2bcd)
//   ├── bin2bcd           (Teacher's FSMD - Binary to BCD)
//   ├── Top_dispSel       (4-to-1 MUX + anode control)
//   │   └── pulse_50hz    (50Hz refresh)
//   └── bcd7seg           (BCD to 7-seg decoder)
//
// ============================================================

module Top_Tally_Counter (
    input  wire        clk,          // 50MHz clock  - FPGA pin T9
    input  wire        rst,          // Reset        - BTN3 - FPGA pin L14
    input  wire        btn,          // Tally button - BTN1 - FPGA pin M14
    output wire [6:0]  seg7_out,     // 7-seg segments {a,b,c,d,e,f,g} active low
    output wire        dp,           // Decimal point always OFF (HIGH = OFF)
    output wire [3:0]  seg_sel_out   // Anode select {AN3,AN2,AN1,AN0} active low
);

    // ============================================================
    // Internal Wires
    // ============================================================
    wire        count_w;        // top_button p_out    -> safe_count logic
    wire        safe_count_w;   // gated count         -> mod999_counter
    wire [9:0]  bin_w;          // mod999_counter      -> bin2bcd
    wire        ready_w;        // bin2bcd ready       -> moore_fsm
    wire        start_w;        // moore_fsm start     -> bin2bcd
    wire        done_w;         // bin2bcd done_tick   -> bcd latch

    wire [3:0]  bcd0_w, bcd1_w, bcd2_w, bcd3_w;  // bin2bcd outputs
    wire [3:0]  bcd_disp_w;                         // Top_dispSel -> bcd7seg

    // ---- BCD latch registers (SMD) ----
    reg [3:0]   bcd0_r, bcd1_r, bcd2_r, bcd3_r;
    reg [3:0]   n_bcd0_r, n_bcd1_r, n_bcd2_r, n_bcd3_r;

    // ---- Block first pulse registers (SMD) ----
    reg         c_block_first, n_block_first;

    // ============================================================
    // Combinational logic
    // ============================================================
    assign safe_count_w = count_w & (~c_block_first);
    assign dp           = 1'b1;   // Decimal point always OFF (active low)

    // ============================================================
    // Sub-Module 1: top_button
    // ============================================================
    top_button TopBtn (
        .btn_in (btn),
        .clk    (clk),
        .rst_p  (rst),
        .p_out  (count_w)
    );

    // ============================================================
    // Sub-Module 2: mod999_counter (Tally Counter)
    // ============================================================
    mod999_counter TallyCount (
        .clk   (clk),
        .rst   (rst),
        .cnt   (safe_count_w),
        .count (bin_w)
    );

    // ============================================================
    // Sub-Module 3: moore_fsm (MyFSM)
    // ============================================================
    moore_fsm MyFSM (
        .clk   (clk),
        .rst   (rst),
        .ready (ready_w),
        .start (start_w)
    );

    // ============================================================
    // Sub-Module 4: bin2bcd (Teacher's FSMD)
    // ============================================================
    bin2bcd BCD (
        .clk       (clk),
        .reset     (rst),
        .start     (start_w),
        .bin       (bin_w),
        .ready     (ready_w),
        .done_tick (done_w),
        .bcd0      (bcd0_w),
        .bcd1      (bcd1_w),
        .bcd2      (bcd2_w),
        .bcd3      (bcd3_w)
    );

    // ============================================================
    // CSL - block_first register (Sequential)
    // ============================================================
    always @(posedge clk or posedge rst) begin
        if (rst)
            c_block_first <= 1'b1;
        else
            c_block_first <= n_block_first;
    end

    // ============================================================
    // NSL - block_first next state (Combinational)
    // ============================================================
    always @(*) begin
        n_block_first = c_block_first;
        if (count_w)
            n_block_first = 1'b0;
    end

    // ============================================================
    // CSL - BCD latch registers (Sequential)
    // ============================================================
    always @(posedge clk or posedge rst) begin
        if (rst) begin
            bcd0_r <= 4'd0;
            bcd1_r <= 4'd0;
            bcd2_r <= 4'd0;
            bcd3_r <= 4'd0;
        end
        else begin
            bcd0_r <= n_bcd0_r;
            bcd1_r <= n_bcd1_r;
            bcd2_r <= n_bcd2_r;
            bcd3_r <= n_bcd3_r;
        end
    end

    // ============================================================
    // NSL - BCD latch next state (Combinational)
    // ============================================================
    always @(*) begin
        // default: hold
        n_bcd0_r = bcd0_r;
        n_bcd1_r = bcd1_r;
        n_bcd2_r = bcd2_r;
        n_bcd3_r = bcd3_r;

        if (bin_w == 10'd0) begin
            n_bcd0_r = 4'd0;
            n_bcd1_r = 4'd0;
            n_bcd2_r = 4'd0;
            n_bcd3_r = 4'd0;
        end
        else if (done_w) begin
            n_bcd0_r = bcd0_w;
            n_bcd1_r = bcd1_w;
            n_bcd2_r = bcd2_w;
            n_bcd3_r = bcd3_w;
        end
    end

    // ============================================================
    // Sub-Module 5: Top_dispSel
    // ============================================================
    Top_dispSel DispSel (
        .clk         (clk),
        .rst         (rst),
        .bcd0        (bcd0_r),
        .bcd1        (bcd1_r),
        .bcd2        (bcd2_r),
        .bcd3        (bcd3_r),
        .bcd_disp    (bcd_disp_w),
        .seg_sel_out (seg_sel_out)
    );

    // ============================================================
    // Sub-Module 6: bcd7seg
    // ============================================================
    bcd7seg Seg7 (
        .bcd_in   (bcd_disp_w),
        .seg7_out (seg7_out)
    );

endmodule
