import React, { ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  //   Paper,
  Fade,
  Stack,
  useTheme,
  Divider,
  DialogProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

export interface DmsModalProps
  extends Omit<Omit<DialogProps, "maxWidth">, "title"> {
  /** Controls whether the modal is displayed */
  open: boolean;
  /** Callback fired when the modal is closed */
  onClose: () => void;
  /** Title element or text to display in modal header */
  title?: ReactNode;
  /** Icon to display next to the title */
  titleIcon?: ReactNode;
  /** Content to display in the modal body */
  children: ReactNode;
  /** Whether to display the modal footer */
  showFooter?: boolean;
  /** Content for the left side of the footer */
  footerLeftContent?: ReactNode;
  /** Content for the right side of the footer */
  footerRightContent?: ReactNode;
  /** Primary action button text */
  primaryButtonText?: string;
  /** Secondary action button text */
  secondaryButtonText?: string;
  /** Primary action button onClick handler */
  onPrimaryAction?: () => void;
  /** Secondary action button onClick handler */
  onSecondaryAction?: () => void;
  /** Whether the primary button should be disabled */
  isPrimaryButtonDisabled?: boolean;
  /** Whether to show the close button in the header */
  showCloseButton?: boolean;
  /** The size of the modal */
  size?: ModalSize;
  /** Whether to show a divider below the header */
  showHeaderDivider?: boolean;
  /** Whether to show a divider above the footer */
  showFooterDivider?: boolean;
  /** Custom header component to replace the default header */
  customHeader?: ReactNode;
  /** Custom footer component to replace the default footer */
  customFooter?: ReactNode;
  /** Custom styles for dialog paper component */
  paperSx?: object;
  /** Custom styles for dialog title component */
  titleSx?: object;
  /** Custom styles for dialog content component */
  contentSx?: object;
  /** Custom styles for dialog actions component */
  actionsSx?: object;
  /** Custom elevation for the Paper component */
  elevation?: number;
}

/**
 * A reusable modal component with customizable header, body, and footer
 */
export const DmsModal: React.FC<DmsModalProps> = ({
  open,
  onClose,
  title,
  titleIcon,
  children,
  showFooter = true,
  footerLeftContent,
  footerRightContent,
  primaryButtonText = "Save",
  secondaryButtonText = "Cancel",
  onPrimaryAction,
  onSecondaryAction,
  isPrimaryButtonDisabled = false,
  showCloseButton = true,
  size = "md",
  showHeaderDivider = true,
  showFooterDivider = true,
  customHeader,
  customFooter,
  paperSx = {},
  titleSx = {},
  contentSx = {},
  actionsSx = {},
  elevation = 4,
  ...dialogProps
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Convert size prop to actual maxWidth value for Dialog
  const getMaxWidth = (): DialogProps["maxWidth"] => {
    if (size === "full") return false;
    return size as DialogProps["maxWidth"];
  };

  // Handle default actions if not provided
  const handlePrimaryAction = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      onClose();
    }
  };

  const handleSecondaryAction = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={getMaxWidth()}
      fullWidth
      fullScreen={size === "full" || (isMobile && size === "xs")}
      TransitionComponent={Fade}
      transitionDuration={300}
      PaperProps={{
        elevation: elevation,
        sx: {
          borderRadius: { xs: size === "full" ? 0 : 2, sm: 2 },
          height:
            size === "full" || (isMobile && size === "xs") ? "100%" : "auto",
          overflowY: "auto",
          ...paperSx,
        },
      }}
      {...dialogProps}
    >
      {customHeader ? (
        customHeader
      ) : (
        <>
          <DialogTitle
            sx={{
              p: { xs: 2, sm: 3 },
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              ...titleSx,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              {titleIcon && <span>{titleIcon}</span>}
              {typeof title === "string" ? (
                <Typography variant={isMobile ? "h6" : "h5"} component="div">
                  {title}
                </Typography>
              ) : (
                title
              )}
            </Stack>
            {showCloseButton && (
              <IconButton
                edge="end"
                color="inherit"
                onClick={onClose}
                aria-label="close"
                size={isMobile ? "small" : "medium"}
              >
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
          {showHeaderDivider && <Divider />}
        </>
      )}

      <DialogContent
        sx={{
          //   p: { xs: 2, sm: 3 },
          p: 0,
          bgcolor: "background.default",
          ...contentSx,
        }}
      >
        {children}
      </DialogContent>

      {showFooter &&
        (customFooter ? (
          customFooter
        ) : (
          <>
            {showFooterDivider && <Divider />}
            <DialogActions
              sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 2.5 },
                bgcolor: "background.paper",
                display: "flex",
                justifyContent: "space-between",
                position: isMobile ? "sticky" : "static",
                bottom: 0,
                zIndex: 1,
                boxShadow: isMobile ? "0px -2px 4px rgba(0,0,0,0.05)" : "none",
                ...actionsSx,
              }}
            >
              <div>{footerLeftContent}</div>
              <Stack direction="row" spacing={1}>
                {secondaryButtonText && (
                  <Button
                    onClick={handleSecondaryAction}
                    color="inherit"
                    size={isMobile ? "medium" : "large"}
                  >
                    {secondaryButtonText}
                  </Button>
                )}
                {primaryButtonText && (
                  <Button
                    variant="contained"
                    onClick={handlePrimaryAction}
                    disabled={isPrimaryButtonDisabled}
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      px: { xs: 3, sm: 4 },
                      fontWeight: "bold",
                    }}
                  >
                    {primaryButtonText}
                  </Button>
                )}
                {footerRightContent}
              </Stack>
            </DialogActions>
          </>
        ))}
    </Dialog>
  );
};
